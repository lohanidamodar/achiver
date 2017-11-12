import React, { Component } from 'react';
import { Container, Content, Text, Icon } from 'native-base';
import { connect } from 'react-redux';
import material from '../../native-base-theme/variables/material';
import SettingsForm from '../components/SettingsForm';
import { TIMER_TYPES } from '../utils/constants';
import { changeTimes } from '../actions/timer';

class SettingsScreen extends Component{
    state = {}
    static navigationOptions = {
        title: 'Statistics',
        tabBarIcon: <Icon  style={{color: material.brandPrimary}} name='settings' />
    };

    handleDurationChange = (type, duration) => {
        let times = {
            [type]:duration
        }
        this.props.changeTimes(times);
    }

    componentWillMount(){
        console.log(this.props);
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <Container>
                <Content>
                    <SettingsForm
                        onChange={this.handleDurationChange}
                        workDuration={this.props.times[TIMER_TYPES.work]}
                        shortBreak={this.props.times[TIMER_TYPES.shortBreak]}
                        longBreak={this.props.times[TIMER_TYPES.longBreak]}
                        sessionLength={this.props.times.sessionsBeforeLongBreak}
                    />
                </Content>
            </Container>
        )
    }
}


const mapStateToProps = (state) => {
     return {
        timer: state.timer,
        times: state.timer.times
    };
}

const mapDispatchToProps = (dispatch) => {
    return{
        changeTimes: (times)=>{
            dispatch(changeTimes(times))
        }
    }
}


SettingsScreen = connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

export default SettingsScreen;