import axios from 'axios';
import { Login, Registration, UserToken } from '../../../../types';

const baseUrl = '/api/user';

let token: string;

const setToken = (newToken: string) => {
    token = `bearer ${newToken}`
}

const getaAuthHeader = () => {
    return { Authorization: token };
}

const createUser = async (user: Registration): Promise<Registration> => {
    const response = await axios.post(`${baseUrl}/register`, user);
    return response.data;
};

const loginUser = async (user: Login): Promise<UserToken> => {
    const response = await axios.post(`${baseUrl}/login`, user);
    setToken(response.data.token);
    return response.data;
};

const logoutUser = () => {
    setToken('');
}

export { createUser, loginUser, logoutUser, getaAuthHeader, setToken };
