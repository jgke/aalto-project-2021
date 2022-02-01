import { IProject } from '../../../../types'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux'
import * as projectService from '../services/projectService'

interface ProjectAction extends Action<string> {
    data: IProject[] | IProject | number | null
}

export const projectReducer = (state: IProject[] = [], action: ProjectAction) => {
    switch(action.type) {
    case 'PROJECT_INIT': {
        return action.data
    }
    case 'PROJECT_ADD': {
        return [ ...state, action.data ]
    }
    case 'PROJECT_DELETE': {
        return state.filter(p => p.id !== action.data)
    }
    case 'PROJECT_UPDATE': {
        const id = (action.data as IProject).id
        return state.map(p => p.id !== id ? p : action.data)
    }
    default: return state
    }
}

export const projectInit = () => {
    return async (dispatch: ThunkDispatch<IProject[], void, ProjectAction>) => {
        const blogs = await projectService.getAll()
        dispatch({
            type: 'PROJECT_INIT',
            data: blogs,
        })
    }
}

export const projectAdd = (project: IProject) => {
    return async (dispatch: ThunkDispatch<IProject[], void, ProjectAction>) => {
        const projectId = await projectService.sendProject(project)
        dispatch({
            type: 'PROJECT_ADD',
            data: {...project, id: projectId},
        })
    }
}

export const projectDelete = (projectId: number) => {
    return async (dispatch: ThunkDispatch<IProject[], void, ProjectAction>) => {
        await projectService.deleteProject(projectId);
        dispatch({
            type: 'PROJECT_DELETE',
            data: projectId,
        })
    }
}

export const projectUpdate = (project: IProject) => {
    return async (dispatch: ThunkDispatch<IProject[], void, ProjectAction>) => {
        await projectService.updateProject(project);
        dispatch({
            type: 'PROJECT_UPDATE',
            data: project,
        })
    }
}