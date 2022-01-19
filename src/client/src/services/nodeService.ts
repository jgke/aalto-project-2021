import axios from 'axios';
import { INode } from '../../../../types';
import { Node } from 'react-flow-renderer';
export const baseUrl = '/api/node';

// Should be possible to give "getAll" a return type
const getAll = async (project_id: number): Promise<INode[]> => {
    const node = await axios.get<INode[]>(`${baseUrl}/${project_id}`);
    return node.data;
};

//What is the actual type? We are sending a JSON to the backend and
//then return an object
const sendNode = async (node: INode): Promise<string> => {
    const response = await axios.post(baseUrl, node);
    //Return the id for that element created by the database
    return response.data.rows[0].id;
};

//deletes node from db then return an object
const deleteNode = async (node: Node<INode>): Promise<{ msg: string }> => {
    const response = await axios.delete(`${baseUrl}/${node.id}`);
    console.log('Node deleted', response.data);
    return response.data;
};
const updateNode = async (node: INode): Promise<void> => {
    console.log('update');
    const response = await axios.put(baseUrl, node);
    return response.data;
};

export { getAll, sendNode, deleteNode, updateNode };
