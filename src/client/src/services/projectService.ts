import axios from 'axios';
import { IProject } from '../../../../types';
import { getAuthHeader } from './userService';
export const baseUrl = '/api/project';

const getConfig = () => ({ headers: getAuthHeader() });

const getAll = async (): Promise<IProject[]> => {
    const project = await axios.get<IProject[]>(baseUrl, getConfig());
    return project.data;
};

const sendProject = async (project: IProject): Promise<number> => {
    const response = await axios.post(baseUrl, project, getConfig());
    return response.data.rows[0].id;
};

const deleteProject = async (projectId: number): Promise<{ msg: string }> => {
    const response = await axios.delete(`${baseUrl}/${projectId}`, getConfig());
    return response.data;
};
const updateProject = async (project: IProject): Promise<void> => {
    const response = await axios.put(baseUrl, project, getConfig());
    return response.data;
};

export { getAll, sendProject, deleteProject, updateProject };
