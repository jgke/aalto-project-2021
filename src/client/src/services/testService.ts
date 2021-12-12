import axios from 'axios';
const baseUrl = '/api/test';

const getAll: () => Promise<{ username: string }> = async () => {
    const request = axios.get(baseUrl);
    const response = await request;
    return response.data;
};

const create = async (text: string): Promise<string> => {
    const response = await axios.post(baseUrl, { text });
    console.log('Post test returned:');
    console.log(response.data);
    return response.data;
};

export { create, getAll };
