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
        logoutUser()
        props.setUser(null);
        navigate('/user/login');
    };
    return (
        <div className="topbar">
            {user && (
                <div>
                    <Link id="home-link" to="/">
                        Home
                    </Link>
                </div>
            )}
            {!user && (
                <div>
                    <Link id="login-link" to="/user/login">
                        Login
                    </Link>
                </div>
            )}
            {!user && (
                <div>
                    <Link id="register-link" to="/user/register">
                        Register
                    </Link>
                </div>
            )}
            {user && (
                <div>
                    <a id="logout-link" href="#" onClick={logOut}>
                        Logout
                    </a>
                </div>
            )}
            {user && <b>Logged in as {user.username}</b>}
        </div>
    );
};
