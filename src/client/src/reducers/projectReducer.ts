import { IProject } from '../../../../types'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux'
import * as projectService from '../services/projectService'

interface ProjectInitAction extends Action<string> {
    type: 'PROJECT_INIT'
    data: IProject[]
}

interface ProjectAddAction extends Action<string> {
    type: 'PROJECT_ADD'
    data: IProject
}

interface ProjectDeleteAction extends Action<string> {
    type: 'PROJECT_DELETE'
    data: number
}

interface ProjectUpdateAction extends Action<string> {
    type: 'PROJECT_UPDATE'
    data: IProject
}

type ProjectState = IProject[];
type ProjectAction = ProjectInitAction | ProjectAddAction | ProjectDeleteAction | ProjectUpdateAction;
type ProjectReturn = IProject[] | IProject | number;

export const projectReducer = (state: ProjectState = [], action: ProjectAction): ProjectReturn => {
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
        return state.map(p => p.id !== action.data.id ? p : action.data)
    }
    default: return state
    }
}

export const projectInit = (): ThunkAction<Promise<void>, ProjectState, void, ProjectInitAction> => {
    return async (dispatch: ThunkDispatch<ProjectState, void, ProjectInitAction>) => {
        const blogs = await projectService.getAll()
        dispatch({
            type: 'PROJECT_INIT',
            data: blogs,
        })
    }
}

export const projectAdd = (project: IProject): ThunkAction<Promise<void>, ProjectState, void, ProjectAddAction> => {
    return async (dispatch: ThunkDispatch<ProjectState, void, ProjectAddAction>) => {
        const projectId = await projectService.sendProject(project)
        dispatch({
            type: 'PROJECT_ADD',
            data: {...project, id: projectId},
        })
    }
}

export const projectDelete = (projectId: number): ThunkAction<Promise<void>, ProjectState, void, ProjectDeleteAction> => {
    return async (dispatch: ThunkDispatch<ProjectState, void, ProjectDeleteAction>) => {
        await projectService.deleteProject(projectId);
        dispatch({
            type: 'PROJECT_DELETE',
            data: projectId,
        })
    }
}

export const projectUpdate = (project: IProject): ThunkAction<Promise<void>, ProjectState, void, ProjectUpdateAction> => {
    return async (dispatch: ThunkDispatch<ProjectState, void, ProjectUpdateAction>) => {
        await projectService.updateProject(project);
        dispatch({
            type: 'PROJECT_UPDATE',
            data: project,
        })
    }
}