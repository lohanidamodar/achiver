import React, { Component } from 'react';
import { Text, List, ListItem, Body, Thumbnail} from 'native-base';
import { PROJECT_STATUS } from './../utils/constants';
import ongoing from '../assets/ongoing.png';
import suspended from '../assets/suspended.png';
import complete from '../assets/complete.png';

class ProjectList extends Component{
    state = { selectedProject: 'none' }
    listItemPressed = (project) => {
        this.props.editProject(project);
    }
    render() {
        const { projects } = this.props;
        return (
            <List dataArray={projects}
                renderRow={(project) =>
                <ListItem style={styles.listItemStyles} button={true}  onPress={()=>{this.listItemPressed(project)}}>
                    {(project.status === PROJECT_STATUS.ongoing) && <Thumbnail square size={80} source={ongoing} />}
                    {(project.status === PROJECT_STATUS.suspended) && <Thumbnail square size={80} source={suspended} />}
                    {(project.status === PROJECT_STATUS.completed) && <Thumbnail square size={80} source={complete} />}
                    <Body>
                        <Text style={styles.listItemTextStyles} >{project.title}</Text>
                    </Body>
                </ListItem>
                }>
            </List>

        )
    }
}

const styles = {
    listItemStyles: {
    },
    listItemTextStyles: {
        fontSize: 20

    }
}

export default ProjectList;