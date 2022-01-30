import { IProject } from '../../../../types'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux'
import * as projectService from '../services/projectService'

export interface ProjectState {
    all: IProject[];
    selected: IProject | null
}

interface ProjectAction extends Action<string> {
    data: IProject[] | IProject | number | null
}

const initalState: ProjectState = {
    all: [],
    selected: null
}

export const projectReducer = (state: ProjectState = initalState, action: ProjectAction) => {
    switch(action.type) {
    case 'PROJECT_INIT': {
        return {...state, ...{ all: action.data }}
    }
    case 'PROJECT_SELECT': {
        return {...state, ...{ selected: action.data }}
    }
    case 'PROJECT_DESELECT': {
        return {...state, ...{ selected: null }}
    }
    case 'PROJECT_ADD': {
        return {...state, ...{ all: [ ...state.all, action.data] }}
    }
    case 'PROJECT_DELETE': {
        return {...state, ...{ all: state.all.filter(p => p.id !== action.data) }}
    }
    case 'PROJECT_UPDATE': {
        const id = (action.data as IProject).id
        const selected = state.selected?.id === id ? null : state.selected;
        return { all: state.all.map(p => p.id !== id ? p : action.data), selected }
    }
    default: return state
    }
}

export const projectInit = () => {
    return async (dispatch: ThunkDispatch<ProjectState, void, ProjectAction>) => {
        const blogs = await projectService.getAll()
        dispatch({
            type: 'PROJECT_INIT',
            data: blogs,
        })
    }
}

export const projectSelect = (project: IProject) => {
    return({
        type: 'PROJECT_SELECT',
        data: project,
    })
}

export const projectDeselect = () => {
    return({
        type: 'PROJECT_DESELECT',
        data: null,
    })
}

export const projectAdd = (project: IProject) => {
    return async (dispatch: ThunkDispatch<ProjectState, void, ProjectAction>) => {
        const projectId = await projectService.sendProject(project)
        dispatch({
            type: 'PROJECT_ADD',
            data: {...project, id: projectId},
        })
    }
}

export const projectDelete = (projectId: number) => {
    return async (dispatch: ThunkDispatch<ProjectState, void, ProjectAction>) => {
        await projectService.deleteProject(projectId);
        dispatch({
            type: 'PROJECT_DELETE',
            data: projectId,
        })
    }
}

export const projectUpdate = (project: IProject) => {
    return async (dispatch: ThunkDispatch<ProjectState, void, ProjectAction>) => {
        await projectService.updateProject(project);
        dispatch({
            type: 'PROJECT_UPDATE',
            data: project,
        })
    }
}