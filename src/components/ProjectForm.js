import React, { Component } from 'react';
import { Container, Content, Form, Item, Input, Label, Button, Text, Picker, Body} from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';

import { View, TouchableOpacity, Image } from 'react-native';
import { TIMER_TYPES, PROJECT_STATUS } from './../utils/constants';
import ongoing from '../assets/ongoing.png';
import suspended from '../assets/suspended.png';
import complete from '../assets/complete.png';
import material from '../../native-base-theme/variables/material';

class ProjectForm extends Component{
    state = {
        status: PROJECT_STATUS.ongoing,
        workDuration: 25,
        title: null,
        editMode: false
    }
    saveProject = () => {
        let id = (this.props.editMode)?this.props.project.id:new Date();
        let project = {
            id: id,
            title: this.state.title,
            status: this.state.status,
            times: {
                [TIMER_TYPES.work]:parseInt(this.state.workDuration) * 60 * 1000,
            }

        }
        console.log(project);
        this.props.saveProject(project);

    }
    deleteProject = () => {
        this.props.deleteProject(this.props.project.id)
    }
    handleChange = (value) => {
        this.setState({
            status: value
        })
    }
    handleDurChange = (value) => {
        console.log(value);
        this.setState({workDuration: parseInt(value)});
    }
    componentWillMount(){
        console.log('componentWillMount', this.props);
        const { editMode, project } = this.props;
        if(editMode){
            this.setState({
                title: project.title,
                status: project.status,
                workDuration: project.times[TIMER_TYPES.work] / (60*1000),
                editMode: true
            })
        }
    }
    render() {
        var workDurOptions = [];
        for(var i=5; i < 60; i= i + 5){
            workDurOptions.push(<Item key={i} label={i.toString()} value={i} />);
        }
        return (
            <Container style={styles.containerStyles}>
                <Content>
                    <View style={styles.contentStyles}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>EDIT PROJECT DETAILS</Text>
                        </View>
                        <Form>
                            <Item floatingLabel last>
                                <Label>Project title</Label>
                                <Input autoFocus={!this.props.editMode} value={this.state.title} editable={true} onChangeText={(text)=>this.setState({title: text})} />
                            </Item>
                            <Text note>Work Duration</Text>
                            <Picker
                                mode="dropdown"
                                placeholder="Select time"
                                selectedValue={this.state.workDuration}
                                onValueChange={this.handleDurChange}
                            >
                                {workDurOptions}
                            </Picker>
                            
                            <Grid>
                                <Col>
                                    <TouchableOpacity onPress={()=>this.setState({status:PROJECT_STATUS.ongoing})} >
                                        <View style={(this.state.status === PROJECT_STATUS.ongoing)?styles.selectedimageButtonStyles:styles.imageButtonStyles}>
                                            <Image style={{width: 50, height: 50}} source={ongoing} />
                                        </View>
                                    </TouchableOpacity>
                                </Col>
                                <Col>
                                    <TouchableOpacity onPress={()=>this.setState({status:PROJECT_STATUS.suspended})}>
                                        <View style={(this.state.status === PROJECT_STATUS.suspended)?styles.selectedimageButtonStyles:styles.imageButtonStyles}>
                                            <Image style={{width: 50, height: 50}} source={suspended} />
                                        </View>
                                    </TouchableOpacity>
                                </Col>
                                <Col>
                                    <TouchableOpacity onPress={()=>this.setState({status:PROJECT_STATUS.completed})}>
                                        <View style={(this.state.status === PROJECT_STATUS.completed)?styles.selectedimageButtonStyles:styles.imageButtonStyles}>
                                            <Image style={{width: 50, height: 50}} source={complete} />
                                        </View>
                                    </TouchableOpacity>
                                </Col>
                            </Grid>

                            <Button style={styles.buttonStyles} block onPress={()=>this.saveProject()}>
                                <Text>Save Project</Text>
                            </Button>
                            {(this.state.editMode) && (<Button style={styles.buttonStyles} block danger onPress={this.deleteProject}><Text>Delete Project</Text></Button>) }
                        </Form>
                    </View>
                </Content>
            </Container>
        )
    }
}

const styles = {
    containerStyles: {
        backgroundColor: 'rgba(0,0,0, 0.7)'
    },
    contentStyles:{
        backgroundColor: '#ffffff',
        width: '90%',
        marginTop: 40,
        alignSelf: 'center',
        padding: 20
    },
    selectedimageButtonStyles: {
        borderColor: "#006699",
        borderWidth: 2,
        width: 60,
        height: 60,
        padding: 5,
        borderRadius: 5
    },
    imageButtonStyles: {
        width: 60,
        height: 60,
        padding: 5
    },
    buttonStyles: {
        marginTop: 10
    },
    header: {
        backgroundColor: material.brandPrimaryLight,
        padding: 10,
        margin: -20,
        marginBottom: 20
    },
    headerText: {
        color: material.inverseTextColor
    }
}

export default ProjectForm;