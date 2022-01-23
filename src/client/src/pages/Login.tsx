import React from 'react'
import { LoginForm } from '../components/loginForm'
import { NavLink } from 'react-router-dom';

export const Login: React.FC = () => {

    return (
        <div>
            <NavLink to="/"> Home </NavLink>
            <NavLink to="/user/register"> Registration </NavLink>
            <LoginForm/>
        </div>
    )
}