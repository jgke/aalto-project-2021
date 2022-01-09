import axios from 'axios';
import { IEdge } from '../../../../types';
export const baseUrl = '/api/edge';

const getAll = async (): Promise<IEdge[]> => {
    const response = await axios.get<IEdge[]>(baseUrl);
    console.log(response.data);
    return response.data;
};

const sendEdge = async (edge: IEdge): Promise<string> => {
    const response = await axios.post(baseUrl, edge);
    console.log('Edge added', response.data);
    return response.data.rows[0].id;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteEdge = async (edge: IEdge): Promise<void> => {
    const response = await axios.delete(`${baseUrl}/${edge.id}`);
    if (response.status !== 200) {
        console.log(`Removing Edge ${edge} failed`);
    } else {
        console.log('Edge removed', edge);
    }
};

const updateEdge = async (edge: IEdge): Promise<void> => {
    const response = await axios.put(baseUrl, edge);
    return response.data;
};

export { getAll, sendEdge, deleteEdge, updateEdge };
