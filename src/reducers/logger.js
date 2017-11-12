const initialState = [];

const logs = (state=initialState, action)=>{
    switch(action.type){
        case 'ADD_LOG':
            console.log(action);
            let newLog = {timestamp: action.log.startTime, projectId: action.log.projectId, duration: action.log.duration, status: action.status}
            return state.concat([newLog]);
        default: return state;
    }
}

export default logs;