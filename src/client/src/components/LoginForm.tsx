import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login, UserToken } from '../../../../types';

export interface LoginFormProps {
    loginUser: (user: Login) => Promise<UserToken>;
    setUser: React.Dispatch<React.SetStateAction<UserToken | null>>;
}

export const LoginForm = (props: LoginFormProps): JSX.Element => {
    const [emailUser, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErr] = useState(['']);

    const navigate = useNavigate();

    const errTimeout = (message: string) => {
        setErr(errMessage.concat(message));

        setTimeout(() => {
            setErr(['']);
        }, 5000);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const user: Login = {
            email: null,
            password: password,
            username: null,
        };

        if (emailUser.length === 0 || password.length === 0) {
            errTimeout('Fill all necessary fields');
            return;
        }

        if (emailUser.includes('@')) {
            user.email = emailUser;
        } else {
            user.username = emailUser;
        }

        try {
            const res: UserToken = await props.loginUser(user);
            const userInfo = JSON.stringify({
                ...res,
                token: `Bearer ${res.token}`,
            });
            window.localStorage.setItem('loggedGraphUser', userInfo);

            setEmail('');
            setPassword('');
            props.setUser(res);
            navigate('/');
        } catch (e) {
            errTimeout('Error occured when logging in');
            console.log('ERROR!', e);
        }
    };

    return (
        <div className="form-box-login">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                {errMessage.map((e) => (
                    <p id="login-error" key={e}>
                        {e}
                    </p>
                ))}
                <div>
                    <label htmlFor="email"></label>
                    <input
                        placeholder="Enter Email or username"
                        name="emailUser"
                        id="emailUser"
                        value={emailUser}
                        onChange={({ target }) => setEmail(target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="psw"></label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name="psw"
                        id="psw"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button id="login-button" type="submit" className="loginbutton">
                    Login
                </button>
            </form>
        </div>
    );
};
