import React from 'react'
import { LoginForm } from '../components/LoginForm'
import { NavLink } from 'react-router-dom';
import { loginUser } from '../services/userService';

export const Login: React.FC = () => {

    return (
        <div>
            <NavLink to="/"> Home </NavLink>
            <NavLink to="/user/register"> Registration </NavLink>
            <LoginForm loginUser={loginUser}/>
        </div>
    )
}