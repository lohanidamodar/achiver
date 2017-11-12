export const addLog = (log, status) => {
  return {
    type: 'ADD_LOG',
    log,
    status
  }
};
