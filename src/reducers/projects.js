import { TIMER_TYPES, PROJECT_STATUS } from '../utils/constants';


const initialState = [
    {
        id: 0,
        title: 'Pomodoro',
        status: PROJECT_STATUS.ongoing,
        times: {
            [TIMER_TYPES.work]: 25 * 60 * 1000,
            sessionsBeforeLongBreak: 4
        }
    }
];

const projects = (state=initialState, action)=>{
    switch(action.type){
        case 'ADD_PROJECT':
            let newProject = {
                ...action.project,
                id: new Date()
            };
            return state.concat([newProject]);
        case 'UPDATE_PROJECT':
            let projects = state.map(project => {
               return (project.id === action.project.id)? action.project : project;
            });
            return projects;
        case 'DELETE_PROJECT':
            return state.filter(project => {
               return (project.id !== action.id) && project;
            });
        default: return state;
    }
}

export default projects;