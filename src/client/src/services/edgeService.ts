import axios from 'axios';
import { Edge } from 'react-flow-renderer';
import { IEdge } from '../../../../types';
import { axiosWrapper } from './axiosWrapper';
export const baseUrl = '/api/edge';

const getAll = async (project_id: number): Promise<IEdge[]> => {
    return (
        (await axiosWrapper(axios.get<IEdge[]>(`${baseUrl}/${project_id}`))) ||
        []
    );
};

const sendEdge = async (edge: IEdge): Promise<boolean> => {
    return (await axiosWrapper(axios.post(baseUrl, edge))) !== undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteEdge = async (edge: Edge<IEdge>): Promise<void> => {
    await axiosWrapper(
        axios.delete(`${baseUrl}/${edge.source}/${edge.target}`)
    );
};

export { getAll, sendEdge, deleteEdge };
