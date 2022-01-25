import React from 'react'
import { UserToken } from '../../../../types';

export const Topbar: ({ email, username, token }: UserToken) => JSX.Element = ({
    username,
    token,
}: UserToken) => {

    //The username does not rerender when logging in. Need to fix
    return (
        <div>
            <a href='/'> Home </a>
            <a href='/user/login'> Login </a>
            <a href='/user/register'> Registration </a>
            <a href='/user/logout'> Logout</a>
            {token && <b>Logged in as {username}</b>}
        </div>
    )
}