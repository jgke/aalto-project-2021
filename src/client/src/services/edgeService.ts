import axios from 'axios';
import { IEdge } from '../../../../types';
import { axiosWrapper } from './axiosWrapper';
import { getAuthConfig } from './userService';
export const baseUrl = '/api/edge';

const getAll = async (project_id: number): Promise<IEdge[]> => {
    return (
        (await axiosWrapper(
            axios.get<IEdge[]>(`${baseUrl}/${project_id}`, getAuthConfig())
        )) || []
    );
};

const sendEdge = async (edge: IEdge): Promise<boolean> => {
    return (
        (await axiosWrapper(axios.post(baseUrl, edge, getAuthConfig()))) !==
        undefined
    );
};

const deleteEdge = async (source: number, target: number): Promise<void> => {
    await axiosWrapper(
        axios.delete(`${baseUrl}/${source}/${target}`, getAuthConfig())
    );
};

export { getAll, sendEdge, deleteEdge };
