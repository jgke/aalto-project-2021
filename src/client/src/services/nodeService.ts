import axios from 'axios';
import { INode } from '../../../../types';
import { Node } from 'react-flow-renderer';
import { axiosWrapper } from './axiosWrapper';
export const baseUrl = '/api/node';

const getAll = async (project_id: number): Promise<INode[]> => {
    return (
        (await axiosWrapper(axios.get<INode[]>(`${baseUrl}/${project_id}`))) ||
        []
    );
};

const sendNode = async (node: INode): Promise<number | undefined> => {
    return (
        (await axiosWrapper(axios.post<{ id: number }>(baseUrl, node))) || {
            id: undefined,
        }
    ).id;
};

const deleteNode = async (node: Node<INode>): Promise<void> => {
    await axiosWrapper(axios.delete(`${baseUrl}/${node.id}`));
};

const updateNode = async (node: INode): Promise<void> => {
    await axiosWrapper(axios.put(baseUrl, node));
};

export { getAll, sendNode, deleteNode, updateNode };
