export const setTime = (time) => {
  return {
    type: 'SET_TIME',
    time,
  }
};

export const setToday = () => {
  return {
    type: 'SET_TODAY'
  }
}

export const changeTimes = (times) => {
  return {
    type: 'CHANGE_TIMES',
    times
  }
}

export const complete = (timerType) => {
  return {
    type: 'COMPLETE',
    timerType,
  };
};

export const startTimer = () => {
  return {
    type: 'START_TIMER',
  };
}

export const stopTimer = () => {
  return {
    type: 'STOP_TIMER',
  }
};

export const pauseTimer = () => {
  return {
    type: 'PAUSE_TIMER'
  }
}

export const resumeTimer = () => {
  return {
    type: 'RESUME_TIMER'
  }
}

export const notified = () => {
  return {
    type: 'NOTIFIED',
  };
};

export const changeProject = (project) =>{
  return {
    type: 'CHANGE_PROJECT',
    project
  }
}