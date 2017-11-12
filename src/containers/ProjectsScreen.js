import React, { Component } from 'react';
import { Modal, Keyboard, ToastAndroid } from 'react-native';
import { Container, Content, Button, Icon, Footer, Input } from 'native-base';
import { addProject, updateProject, deleteProject } from '../actions/projects';
import { connect } from 'react-redux';
import material from '../../native-base-theme/variables/material';
import ProjectList from '../components/ProjectList';
import ProjectForm from '../components/ProjectForm'
import { TIMER_TYPES, PROJECT_STATUS } from './../utils/constants';


class ProjectsScreen extends Component{
    state = {
        active: false,
        modalVisible: false,
        selectedProject: null,
        editMode: false,
        projectTitle: null
    }
    static navigationOptions = {
        title: 'Project',
        headerStyle: {backgroundColor: 'transparent'},
        tabBarIcon: <Icon name="book"  style={{color: material.brandPrimary}}  />
    };
    saveProject = (project) => {
        if(this.state.editMode){
            this.props.updateProject(project).then(()=>this.handleModalClose())
        }else{
            if(!this.state.projectTitle){
                ToastAndroid.show('Please enter project title to add project', ToastAndroid.SHORT)
                return;
            }
            project = {
                id: new Date(),
                title: this.state.projectTitle,
                status: PROJECT_STATUS.ongoing,
                times: {
                    [TIMER_TYPES.work]:25 * 60 * 1000,
                }
            }
            this.setState({projectTitle: null});
            Keyboard.dismiss();
            this.props.saveProject(project).then(()=>this.handleModalClose())
            ToastAndroid.show('Project added successfully', ToastAndroid.SHORT)
        }
    }
    deleteProject = (id) => {
        this.props.deleteProject(id);
        this.handleModalClose();
    }
    handleModalClose = () => {
        this.setState({modalVisible: false, editMode: false, selectedProject: null});
    }
    editProject = (project) => {
        this.setState({selectedProject: project, editMode: true, modalVisible: true})
    }

    render(){
        const { navigate } = this.props.navigation;
        return(
            <Container>
                <Content style={{paddingBottom: 140}}>
                    <ProjectList editProject={this.editProject} projects={this.props.projects} navigate={navigate} />
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={this.handleModalClose}
                        >
                        <ProjectForm editMode={this.state.editMode} project={this.state.selectedProject} saveProject={this.saveProject} deleteProject={this.deleteProject} />
                    </Modal>
                </Content>
                <Footer style={styles.footerStyles} >
                    <Input 
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onSubmitEditing={this.saveProject}
                        onChangeText={(text)=>this.setState({projectTitle: text})}
                        value={this.state.projectTitle}
                        placeholderTextColor={material.inputColorPlaceholder} style={styles.footerInputStyles} 
                        placeholder='enter project title'/>
                    <Button onPress={this.saveProject} style={styles.footerButtonStyles} info transparent icon><Icon name="checkmark-circle" /></Button>
                </Footer>
            </Container>
        )
    }
}

const styles = {
    footerStyles: {
        backgroundColor: material.lightBgColor
    },
    footerButtonStyles: {
        marginTop: 5
    },
    footerInputStyles: {
        color: material.inputColor
    }
}

const mapStateToProps = (state) => {
     return {
        projects: state.projects,
    };
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveProject: (project) => new Promise((resolve,reject)=>{
      dispatch(addProject(project));
      resolve();
    }),
    updateProject: (project) => new Promise((resolve,reject) => {
      dispatch(updateProject(project));
      resolve();
    }),
    deleteProject: (id)=>{
        dispatch(deleteProject(id));
    }
  };
}

ProjectsScreen = connect(mapStateToProps, mapDispatchToProps)(ProjectsScreen);

export default ProjectsScreen;