import axios from 'axios';
import { IProject } from '../../../../types';
import { axiosWrapper } from './axiosWrapper';
import { getAuthHeader } from './userService';
export const baseUrl = '/api/project';

const getConfig = () => ({ headers: getAuthHeader() });

const getAll = async (): Promise<IProject[]> => {
    const project = await axiosWrapper(
        axios.get<IProject[]>(baseUrl, getConfig())
    );
    return project || [];
};

const sendProject = async (project: IProject): Promise<number | undefined> => {
    const response = await axiosWrapper(
        axios.post<{ id: number }>(baseUrl, project, getConfig())
    );
    console.log(response);
    return response?.id;
};

const deleteProject = async (projectId: number): Promise<void> => {
    return await axiosWrapper(
        axios.delete(`${baseUrl}/${projectId}`, getConfig())
    );
};
const updateProject = async (project: IProject): Promise<void> => {
    return await axiosWrapper(axios.put(baseUrl, project, getConfig()));
};

export { getAll, sendProject, deleteProject, updateProject };
