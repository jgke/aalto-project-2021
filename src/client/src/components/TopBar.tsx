import React from 'react'
import { NavLink } from 'react-router-dom';
import { UserToken } from '../../../../types';

export const Topbar: ({ email, username, token }: UserToken) => JSX.Element = ({
    username,
    token,
}: UserToken) => {

    //The username does not rerender when logging in. Need to fix
    return (
        <div>
            <NavLink to='/'> Home </NavLink>
            <NavLink to='/user/login'> Login </NavLink>
            <NavLink to='/user/register'> Registration </NavLink>
            <NavLink to='/user/logout'> Logout</NavLink>
            {token && <b>Logged in as {username}</b>}
        </div>
    )
}