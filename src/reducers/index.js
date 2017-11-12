import { combineReducers } from 'redux';
import timer from './timer.js';
import projects from './projects.js';
import logs from './logger';

export default combineReducers({
  timer,
  projects,
  logs
});