import axios from 'axios';
import { Login, Registration, UserToken } from '../../../../types';
import { axiosWrapper } from './axiosWrapper';

const baseUrl = '/api/user';

const createUser = async (user: Registration): Promise<boolean> => {
    return (
        (await axiosWrapper(axios.post(`${baseUrl}/register`, user))) !==
        undefined
    );
};

const loginUser = async (user: Login): Promise<UserToken | undefined> => {
    return await axiosWrapper(axios.post<UserToken>(`${baseUrl}/login`, user));
};

export { createUser, loginUser };
