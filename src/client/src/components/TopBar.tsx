import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserToken } from '../../../../types';
import { logoutUser } from '../services/userService';

export interface TopbarProps {
    user: UserToken | null;
    setUser: React.Dispatch<React.SetStateAction<UserToken | null>>;
}

export const Topbar = (props: TopbarProps): JSX.Element => {
    const navigate = useNavigate();
    //The username does not rerender when logging in. Need to fix
    const user = props.user;

    const logOut = () => {
        window.localStorage.removeItem('loggedGraphUser');
        logoutUser();
        props.setUser(null);
        navigate('/user/login');
    };
    return (
        <div className="topbar">
            {user && (
                <Link className="link-topbar" id="home-link" to="/">
                    Home
                </Link>
            )}
            {!user && (
                <Link className="link-topbar" id="login-link" to="/user/login">
                    Login
                </Link>
            )}
            {!user && (
                <Link
                    className="link-topbar"
                    id="register-link"
                    to="/user/register"
                >
                    Register
                </Link>
            )}
            {user && (
                <a
                    className="link-topbar"
                    id="logout-link"
                    href="#"
                    onClick={logOut}
                >
                    Logout
                </a>
            )}
            {user && <div id="whoamiText">Logged in as {user.username}</div>}
        </div>
    );
};
