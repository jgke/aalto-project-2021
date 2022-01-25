import React, { useState } from 'react';
import { Login, LoginFormProps, UserToken } from '../../../../types';

export const LoginForm: ({ loginUser }: LoginFormProps) => JSX.Element = ({
    loginUser,
}: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErr] = useState(['']);

    const errTimeout = (message: string) => {
        setErr(errMessage.concat(message))

        setTimeout(() => {
            setErr(['']);
        }, 5000);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (email.length === 0 || password.length === 0) {
            errTimeout('Fill all necessary fields');
            return;
        }

        if (!email.includes('@')) {
            errTimeout('Email missing @');
            return;
        }

        const user: Login = {
            email: email,
            password: password,
        };
        try {
            const res: UserToken = await loginUser(user);
            const userInfo = JSON.stringify({ ...res, token: `Bearer ${res.token}`})
            console.log('UserInfo?!?!?', userInfo)
            window.localStorage.setItem('loggedGraphUser', userInfo)

            setEmail('');
            setPassword('');
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
                    <p key={e}>{e}</p>
                ))}
                <div>
                    <label htmlFor="email">
                        <b>Email</b>
                    </label>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="psw">
                        <b>Password</b>
                    </label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name="psw"
                        id="psw"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button id='login-button' type="submit" className="loginbutton">
                    Login
                </button>
            </form>
        </div>
    );
};
