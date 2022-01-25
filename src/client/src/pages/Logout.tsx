import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Logout: React.FC = () => {

    const navigate = useNavigate();

    useEffect(() => {
        window.localStorage.removeItem('loggedGraphUser')
        navigate('/user/login')

    }, [])
    
    return null;
};
