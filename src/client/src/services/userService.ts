import axios from 'axios';
import { Login, Registration, UserToken } from '../../../../types';

const baseUrl = '/api/user';

const createUser = async (user: Registration): Promise<Registration> => {
    const response = await axios.post(`${baseUrl}/register`, user);
    return response.data;
};

const loginUser = async (user: Login): Promise<UserToken> => {
    const response = await axios.post(`${baseUrl}/login`, user);
    return response.data;
};

export { createUser, loginUser };
