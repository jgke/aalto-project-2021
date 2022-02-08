import axios from 'axios';
import { INode } from '../../../../types';
import { Node } from 'react-flow-renderer';
import { axiosWrapper } from './axiosWrapper';
export const baseUrl = '/api/node';

const getAll = async (): Promise<INode[]> => {
    return (await axiosWrapper(axios.get<INode[]>(baseUrl))) || [];
};

const sendNode = async (node: INode): Promise<string | undefined> => {
    return (
        (await axiosWrapper(axios.post<{ id: string }>(baseUrl, node))) || {
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
