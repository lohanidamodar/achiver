import { TIMER_TYPES } from '../utils/constants';
import {REHYDRATE} from 'redux-persist/constants'


const initalState = {
  startTime: 0,
  active: false,
  count: 0,
  currentTime: 0,
  timerType: TIMER_TYPES.work,
  notify: false,
  projectId: 0,
  resetSessionsAfter: 120 * 60 * 1000,
  sessionsCompleted: 0,
  today: +new Date(),
  times: {
    [TIMER_TYPES.work]: 25 * 60 * 1000,
    [TIMER_TYPES.shortBreak]: 5 * 60 * 1000,
    [TIMER_TYPES.longBreak]: 15 * 60 * 1000,
    sessionsBeforeLongBreak: 4
  }
};

const timer = (state = initalState, action) => {
  switch (action.type) {
    case 'SET_TIME':
      return {
        ...state,
        currentTime: action.time,
      };
    case 'SET_TODAY':
      return {
        ...state,
        today: new Date(),
        sessionsCompleted: 0,
        count: 0
      };
    case 'START_TIMER':
      return {
        ...state,
        startTime: new Date(),
        active: true,
        notify: false,
      };
    case 'STOP_TIMER':
      return {
        ...state,
        timerType: TIMER_TYPES.work,
        currentTime: state.times[TIMER_TYPES.work],
        active: false,
      };
    case 'PAUSE_TIMER':
      return {
        ...state,
        active: false
      }
    case 'RESUME_TIMER':
      return {
        ...state,
        active: true
      }
    case 'COMPLETE':
      return {
        ...state,
        active: false,
        count: (action.timerType === TIMER_TYPES.work) ? (state.count + 1)% state.times.sessionsBeforeLongBreak : (action.timerType === TIMER_TYPES.longBreak)?0 : state.count,
        sessionsCompleted: (action.timerType === TIMER_TYPES.work)?state.sessionsCompleted+1:state.sessionsCompleted,
        timerType: (action.timerType === TIMER_TYPES.work)?((state.count>=(state.times.sessionsBeforeLongBreak-1))?TIMER_TYPES.longBreak:TIMER_TYPES.shortBreak):TIMER_TYPES.work,
        notify: true,
      };
    case 'CHANGE_TIMES':
        return {
          ...state,
          times: {
            ...state.times,
            ...action.times
          }
        }
    case 'CHANGE_PROJECT':{
      return {
        ...state,
        projectId: action.project.id,
        times: {
          ...state.times,
          ...action.project.times
        }
      }
    }
    case 'NOTIFIED':
      return {
        ...state,
        notify: false,
      }
    case REHYDRATE:
      var incoming = action.payload.timer
      console.log('timer rehydrated', incoming)
      if (incoming) return {...state, ...incoming, active: false, curentTime: 0}
      return state
    default:
      return state;
  }
};

export default timer;