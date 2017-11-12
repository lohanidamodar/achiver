export const addProject = (project) => {
  return {
    type: 'ADD_PROJECT',
    project,
  }
};
export const updateProject = (project) =>{
    return {
        type: 'UPDATE_PROJECT',
        project
    }
}

export const deleteProject= (id) => {
  return {
    type: 'DELETE_PROJECT',
    id
  }
}