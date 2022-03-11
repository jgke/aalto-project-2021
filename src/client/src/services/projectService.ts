import axios from 'axios';
import { IProject, ProjectInvite, ProjectPermissions } from '../../../../types';
import { axiosWrapper } from './axiosWrapper';
import { getAuthConfig } from './userService';
export const baseUrl = '/api/project';

const getAll = async (): Promise<IProject[]> => {
    const project = await axiosWrapper(
        axios.get<IProject[]>(baseUrl, getAuthConfig())
    );
    return project || [];
};

const getProject = async (projectId: number): Promise<IProject | undefined> => {
    const project = await axiosWrapper(
        axios.get<IProject>(`${baseUrl}/${projectId}`, getAuthConfig())
    );
    return project;
};

const getProjectPermissions = async (
    projectId: number
): Promise<ProjectPermissions> => {
    const project = await axiosWrapper(
        axios.get<ProjectPermissions>(
            `${baseUrl}/${projectId}/permission`,
            getAuthConfig()
        )
    );
    return project || { view: false, edit: false };
};

const sendProject = async (project: IProject): Promise<number | undefined> => {
    const response = await axiosWrapper(
        axios.post<{ id: number }>(baseUrl, project, getAuthConfig())
    );
    console.log(response);
    return response?.id;
};

const deleteProject = async (projectId: number): Promise<void> => {
    return await axiosWrapper(
        axios.delete(`${baseUrl}/${projectId}`, getAuthConfig())
    );
};
const updateProject = async (project: IProject): Promise<void> => {
    return await axiosWrapper(axios.put(baseUrl, project, getAuthConfig()));
};

const inviteUsers = async (projectId: number, invited: string[]): Promise<void> => {
    const request: ProjectInvite = { projectId, invited }
    return await axiosWrapper(axios.post(`${baseUrl}/members`, request, getAuthConfig()));
}

export {
    getAll,
    getProject,
    getProjectPermissions,
    sendProject,
    deleteProject,
    updateProject,
    inviteUsers
};
