import axios from 'axios';
import { ITag, ITaggedNode } from '../../../../types';
export const baseUrl = '/api/tag';


const getAll = async (): Promise<ITag[]> => {
    const tag = await axios.get<ITag[]>(baseUrl);
    return tag.data;
};

const sendTag = async (tag: ITag): Promise<number> => {
    const response = await axios.post(baseUrl, tag);
    return response.data.rows[0].id;
};

const deleteTag = async (tagId: number): Promise<{ msg: string }> => {
    const response = await axios.delete(`${baseUrl}/${tagId}`);
    return response.data;
};
const updateTag = async (tag: ITag): Promise<void> => {
    const response = await axios.put(baseUrl, tag);
    return response.data;
};

export { getAll, sendTag, deleteTag, updateTag };