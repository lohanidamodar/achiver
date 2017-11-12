import React, { Component } from 'react';
import { View, Text, Button, Picker, Item, List, ListItem, Body, Right } from 'native-base';
import material from '../../native-base-theme/variables/material';
import ProgressCircle from 'react-native-progress/Circle';

import {PROJECT_STATUS, TIMER_TYPES} from '../utils/constants';


class Timer extends Component{
    static navigationOptions = {
        title: 'Timer',
        headerStyle: {backgroundColor: 'transparent'},
    };

    
    handleProjectChange = (value) => {
        console.log('Timer: handleProjectChange', value);
        this.props.handleProjectChange(value);
    }

    render() {
        let projects = [];
        this.props.projects.map(project=>(project.status === PROJECT_STATUS.ongoing) && projects.push(<Item key={project.id} value={project.id} label={project.title} />))
        return (
            <View style={{paddingTop: 20}}>
                <ProgressCircle color={material.brandInfo} unfilledColor="#f2f2f2" style={{alignSelf:'center'}} borderWidth={0} thickness={15} strokeCap="round" showsText={true} textStyle={{ fontWeight: '900', fontSize: 40}} formatText={this.props.time} size={180} progress={this.props.progress} />

                <List style={{marginTop: 10}} >
                    <ListItem>
                        <Body>
                            <Text note>SELECTED PROJECT</Text>
                            <Picker
                                mode="dropdown"
                                placeholder="Select One"
                                selectedValue={this.props.selectedProject}
                                onValueChange={this.props.handleProjectChange}>
                                {projects}
                            </Picker>
                        </Body>
                    </ListItem>
                    <ListItem>
                        <Body>
                            <Text>SESSIONS COMPLETED TODAY</Text>
                        </Body>
                        <Right>
                            <Text>{this.props.sessionsCompleted}</Text>
                        </Right>
                    </ListItem>
                </List>

                {this.props.isPlaying && <Button style={styles.buttonStyles} block danger onPress={()=>this.props.stop()}>
                    <Text>{(this.props.timerType===TIMER_TYPES.work)? "Forfeit Work" : "Skip break"}</Text>
                </Button>}
                {!this.props.isPlaying && <Button style={styles.buttonStyles} block primary onPress={()=>this.props.start()}>
                    <Text>{(this.props.timerType === TIMER_TYPES.work)?"Start Working":"Start break"}</Text>
                </Button>}

                {((this.props.timerType === TIMER_TYPES.shortBreak || this.props.timerType === TIMER_TYPES.longBreak) && !this.props.isPlaying ) && <Button style={styles.buttonStyles} block danger onPress={() => this.props.stop()}><Text>Skip Break</Text></Button> }
            </View>
        )
    }
}

const styles = {
    timeStyles: {
        fontSize: 100,
        alignSelf: 'center',
        marginBottom: 30,
        marginTop: 30,
        fontWeight: '900',
        color: material.brandInfo
    },
    buttonStyles:{
        marginTop: 10
    }
}


export default Timer;