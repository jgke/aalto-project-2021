import axios from 'axios';
import { Registration } from '../../../../types';

const baseUrl = '/api/user'

const createUser = async(user: Registration): Promise<Registration> => {
    const response = await axios.post(`${baseUrl}/register`, user)
    return response.data

}

export { createUser }