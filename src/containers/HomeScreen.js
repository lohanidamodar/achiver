import React, { Component } from 'react';
import { AsyncStorage, AppState } from 'react-native';
import { Container, Content, Text, View, Icon } from 'native-base';
import { connect } from 'react-redux';
import material from '../../native-base-theme/variables/material';
import moment from 'moment';


import { TIMER_TYPES, LOG_STATUS } from './../utils/constants';
import { notify, removeNotification } from '../utils/notifications.js';
import store from './../store';
import { setTime, complete, stopTimer, startTimer, pauseTimer, resumeTimer, changeProject, setToday } from '../actions/timer';
import { addLog } from './../actions/logger';
import projects from '../assets/projects.png';
import Timer from '../components/Timer';

import AppLauncher from '../native/AppLauncher';
import SoundManager from '../native/SoundManager';


class HomeScreen extends Component{
    static navigationOptions = {
        title: 'Welcome',
        tabBarIcon: () => (<Icon style={{color: material.brandPrimary}} name='timer' />)
    };
    state = {
        appState: AppState.currentState,
        savedValue: null,
        selectedProject: this.props.selectedProject,
        time: this.props.time,
        loading: true
    }

    handleStart = ()=>{
        this.props.startTimer();
        this.timer = this.startTimer();
    }

    startTimer = () => {
        this.setState({isPlaying: true});
        return setInterval( () => {
            if (this.state.time > 0) {
                this.setState({
                    time: this.state.time - 1000,
                })
                this.getPercent();
            } else {
                this.timeOver();
            }
        }, 1000);
    }

    timeOver = () => {
        this.handleStop();
        this.props.complete({
            startTime: this.props.startTime,
            projectId: this.props.selectedProject,
            timerType: this.props.timerType,
            duration: this.props.times[this.props.timerType]
        });
        // notify
    }

    handleStop = () => {
        this.props.stopTimer(this.props).then(()=>{
            this.setState({
                time: this.props.time,
                isPlaying: false
            })
            this.getPercent();
            AsyncStorage.removeItem('timer_key',error=>console.log(error));
        });
        (!SoundManager.isPlaying) && SoundManager.timerComplete();
        clearInterval(this.timer);
        this.timer = null;
    }

    handleProjectChange = (projectId) => {
        let project = this.props.projects.find(project=>project.id === projectId);
        console.log('handleProjectChange', project);
        if(!this.state.isPlaying){
        this.props.changeProject(project).then(()=>{
                this.setState({
                    time: this.props.time,
                    selectedProject: this.props.selectedProject
                })
                this.getPercent();
            });
        }
    }

    _handleAppStateChange = (nextAppState) => {
        if(nextAppState==='background' || nextAppState.match(/inactive|background/)){
            this.saveValue();
        }
        if (nextAppState === 'active') {
          this.getValue();
        }
        console.log('app in state', nextAppState);
        this.setState({appState: nextAppState});
    }
    saveValue = () => {
        if(this.state.isPlaying){
            let startTime = new Date(this.props.startTime).getTime();
            let dur = parseInt(this.props.time);
            let notifDate = new Date(startTime + dur);
            removeNotification(25);
            AppLauncher.clearAlarm('my-alarm');
            AppLauncher.setAlarm('my-alarm',notifDate.getTime());
            let title = "Work session completed."
            let bigText = "Continue good work. Time for break."
            if(this.props.timerType !== TIMER_TYPES.work){
                title = "Break Over!";
                bigText = "Time to work. Procastinate later!"
            }
            var message = {
                id: 25,
                title: title,
                bigText: bigText,
                date: notifDate
            }
            var data = {
                startTime: this.props.startTime.toString(),
                duration: this.props.time,
                selectedProject: this.props.selectedProject,
                timerType: this.props.timerType
            }
            this.props.pauseTimer();
            AsyncStorage.setItem('timer_key', JSON.stringify(data));
            notify(message);
        }
    }

    getValue = () => {
        AsyncStorage.getItem('timer_key').then(value=>{
            if(value){
                AppLauncher.clearAlarm('my-alarm');
                value = JSON.parse(value);
                let now = new Date();
                let stTime = new Date(value.startTime);
                let rTime = value.duration - (now - stTime);
                if(rTime > 0){
                    this.setState({time: rTime, savedValue: rTime.toString()}); 
                    this.props.resumeTimer();
                    if(!this.timer){
                        this.timer = this.startTimer();
                    }
                }else{
                    this.setState({complete: true, data: {
                        startTime: stTime,
                        duration: value.duration,
                        projectId: value.selectedProject,
                        timerType: value.timerType
                    }})
                    
                    AsyncStorage.removeItem('timer_key');
                }
            }
        }).done();
    }

    getTime = () => {
        return moment.utc(this.state.time).format('mm:ss');
    }

    getPercent = () => {
        let progress = ((this.props.time - this.state.time) / this.props.time * 1);
        this.setState({progress: progress})
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillMount() {
        this.setState({
            time: this.props.time,
            maxtime: this.props.time,
            isPlaying: this.props.activeTimer
        })

            
    }
    componentWillReceiveProps(nextProps){
        console.log('home-screen, should-component-update', nextProps)
        if(nextProps.screenProps.rehydrated){
            console.log('home-screen rehydrated');
            (!this.state.isPlaying) && this.setState({time: this.props.time, maxTime: this.props.time})
            let today = new Date();
            today = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
            let stateDate = new Date(this.props.today);
            stateDate = stateDate.getFullYear() + "-" + (stateDate.getMonth() + 1) + "-" + stateDate.getDate();
                    
            if(today !== stateDate){
                this.props.setToday()
            }
            if(this.state.complete){
                this.props.complete(this.state.data);
                this.setState({complete: false})
                console.log('firing this.props.complete with', this.state.data)
            }
            this.setState({rehydrated: true, loading: false})
            console.log('home-screen state',this.state);
        }

        if(!this.state.isPlaying){
            if(this.props.timerType !== nextProps.timerType){
                this.setState({time: nextProps.times[nextProps.timerType]});
            }
            selectedProject =  nextProps.projects.find((project)=>{
                return (project.id == nextProps.selectedProject) && project
            });
            if( this.props.timerType === TIMER_TYPES.work && selectedProject && this.props.time != selectedProject.times[this.props.timerType]){
                this.setState({time: selectedProject.times[this.props.timerType]});
            }
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer);
        this.props.pauseTimer();
        this.timer = null;
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    render(){
        const { navigate } = this.props.navigation;
        return(
            <Container style={styles.containerStyles}>
                <Content>
                    <Timer 
                        start={this.handleStart}
                        stop={this.handleStop}
                        timerType={this.props.timerType}
                        handleProjectChange={this.handleProjectChange}
                        projects={this.props.projects}
                        sessionsCompleted={this.props.sessionsCompleted}
                        isPlaying={this.state.isPlaying}
                        progress={this.state.progress}
                        selectedProject={this.props.selectedProject}
                        time={this.getTime} />
                </Content>
                {this.state.loading && <View style={styles.loading}>
                        <Text>Loading</Text>
                    </View>}
            </Container>
        )
    }
}

const styles = {
    containerStyles: {
        padding: 10,
        backgroundColor: material.inverseTextColor,
        position: "relative"
    },
    loading: {
        backgroundColor: "#ffffff",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
}



const mapStateToProps = (state) => {
    return {
       time: state.timer.times[state.timer.timerType],
       timerType: state.timer.timerType,
       activeTimer: state.timer.active,
       timerCount: state.timer.count,
       times: state.timer.times,
       startTime: state.timer.startTime,
       logs: state.logs,
       projects: state.projects,
       selectedProject: state.timer.projectId,
       sessionsCompleted: state.timer.sessionsCompleted,
       today: state.timer.today
   };
}

const mapDispatchToProps = (dispatch) => {
 return {
   complete: (timer) => {
     (timer.timerType===TIMER_TYPES.work) && dispatch(addLog(timer, LOG_STATUS.completed));
     dispatch(complete(timer.timerType));
   },
   setToday: () => {
       dispatch(setToday());
   },
   startTimer: () => {
     dispatch(startTimer());
   },
   stopTimer: (log) => new Promise((resolve,reject)=>{
     dispatch(stopTimer());
     resolve();
   }),
   pauseTimer: () => {
       dispatch(pauseTimer());
   },
   resumeTimer: () => {
       dispatch(resumeTimer());
   },
   changeProject: (project)=>new Promise((resolve,reject)=>{
       dispatch(changeProject(project));
       resolve();
   }),
   addLog: (log, status) => {
       dispatch(addLog(log, status));
   }
 };
}

HomeScreen = connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

export default HomeScreen;