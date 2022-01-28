import axios from 'axios';
import { IProject } from '../../../../types';
export const baseUrl = '/api/project';

const getAll = async (): Promise<IProject[]> => {
    const project = await axios.get<IProject[]>(baseUrl);
    return project.data;
};

const sendProject = async (project: IProject): Promise<number> => {
    const response = await axios.post(baseUrl, project);
    return response.data.rows[0].id;
};

const deleteProject = async (projectId: number): Promise<{ msg: string }> => {
    const response = await axios.delete(`${baseUrl}/${projectId}`);
    return response.data;
};
const updateProject = async (project: IProject): Promise<void> => {
    const response = await axios.put(baseUrl, project);
    return response.data;
};

export { getAll, sendProject, deleteProject, updateProject };
