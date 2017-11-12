import React, { Component } from 'react';
import { ToastAndroid } from 'react-native';
import { Container, Content, Footer, Body, Text, Icon, List, ListItem, Right, Button } from 'native-base';
import { addProject, updateProject } from '../actions/projects';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import material from '../../native-base-theme/variables/material';
import moment from 'moment';

class StatsScreen extends Component{
    state = {
        total: 0,
        totalSessions: 0,
        projectTotal: {},
        today: moment(new Date()).format("YYYY-MM-DD"),
        logs: [],
        projects: [] 
    }
    static navigationOptions = {
        title: 'Statistics',
        tabBarIcon: <Icon  style={{color: material.brandPrimary}} name='stats' />
    };
    prepareStats = () => {
        console.log(this.props.logs)
        let projectTotal={}, total=0, totalSessions=0;
        let logs = this.props.logs.filter(log=>{
            let logDate = moment(new Date(log.timestamp)).format("YYYY-MM-DD");
            if (this.state.today === logDate) {
                console.log("today:", this.state.today, "logDate:", logDate);
                if(!projectTotal[log.projectId]){
                    projectTotal[log.projectId] = 0;
                }
                total += parseInt(log.duration);
                projectTotal[log.projectId] = projectTotal[log.projectId] + parseInt(log.duration)
                totalSessions++;
                return log;
           };
        })
        let projects = this.props.projects.filter(project => {return projectTotal[project.id] && project} );
        this.setState({logs: logs, projects: projects, total: total, projectTotal: projectTotal, totalSessions: totalSessions});
        console.log(this.state);
    }
    componentWillReceiveProps = (nextProps) => {
        if(nextProps.screenProps.rehydrated){
            this.prepareStats();
        }
        if(nextProps.logs !== this.props.logs){
            this.prepareStats();
        }
    }
    componentDidUpdate(){
        console.log('component-did-update', this.state);
    }
    writeLog = () => {
        var data = {
            projects: this.props.projects,
            logs: this.props.logs
        }
        // create a path you want to write to
        let path = RNFS.ExternalDirectoryPath + '/achiver-logs.json';
        // write the file
        RNFS.writeFile(path, JSON.stringify(data), 'utf8')
            .then((success) => {
                ToastAndroid.show('Exported to ' + path, ToastAndroid.SHORT)                
            })
            .catch((err) => {
                ToastAndroid.show(err.message, ToastAndroid.LONG)
                console.log(err.message);
            });
    }
    render(){
        let total = moment.duration(this.state.total);
        return(
            <Container>
                <Content>
                    <Text> On {moment(this.state.today).format("dddd, MMMM D, YYYY")} you finished total of {this.state.totalSessions} sessions with a total of {(total.hours() > 0) && moment.duration(total.hours(),'hours').humanize()} {(total.minutes() > 0) && "and " + moment.duration(total.minutes(), 'minutes').humanize()}</Text>

                    <List>
                        {this.state.projects.map(project=>{
                            let dur = moment.duration(this.state.projectTotal[project.id]);
                            return(
                                <ListItem key={project.id}>
                                    <Body>
                                        <Text>{project.title}</Text>
                                    </Body>
                                    <Right>
                                        <Text>{dur.hours()}h {dur.minutes()}m</Text>
                                    </Right>
                                </ListItem>
                            )
                        })}
                    </List>
                </Content>
                <Footer style={footerStyles}>
                    <Button full onPress={this.writeLog}><Text>Export</Text></Button>
                </Footer>
            </Container>
        )
    }
}
const footerStyles = {
    backgroundColor: material.lightBgColor
}

const mapStateToProps = (state) => {
     return {
        logs: state.logs,
        projects: state.projects
    };
}



StatsScreen = connect(mapStateToProps)(StatsScreen);

export default StatsScreen;