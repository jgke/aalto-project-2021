import React from 'react';
import { LoginForm } from '../components/LoginForm';
import { Topbar } from '../components/TopBar';
import { loginUser } from '../services/userService';

export const Login: React.FC = () => {
    return (
        <div>
            <Topbar username={null} email={null} token={null} />
            <LoginForm loginUser={loginUser} />
        </div>
    );
};
