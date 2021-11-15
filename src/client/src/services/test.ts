import axios from 'axios'
const baseUrl = '/api/test'

const getAll = async () => {
    const request = axios.get(baseUrl);
    const response = await request;
    return response.data;
}

const create = async (text: string) => {
    const response = await axios.post(baseUrl, {text})
    return response.data
}


export { create, getAll }