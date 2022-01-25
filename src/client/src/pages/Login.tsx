import React from 'react';
import { LoginForm } from '../components/LoginForm';
import { loginUser } from '../services/userService';
import { Topbar } from '../components/TopBar';

export const Login: React.FC = () => {
    return (
        <div>
            <Topbar username={null} email={null} token={null}/>
            <LoginForm loginUser={loginUser} />
        </div>
    );
};
