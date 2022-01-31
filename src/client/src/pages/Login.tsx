import React from 'react';
import { LoginForm } from '../components/LoginForm';
import { loginUser } from '../services/userService';

export const Login: React.FC = () => {
    return (
        <div>
            <LoginForm loginUser={loginUser} />
        </div>
    );
};
