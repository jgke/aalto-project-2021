import React, { useState } from 'react';
import { Login, LoginFormProps } from '../../../../types';

export const LoginForm: ({ loginUser }: LoginFormProps) => JSX.Element = ({
    loginUser,
}: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErr] = useState(['']);

    const errTimeout = () => {
        setTimeout(() => {
            setErr(['']);
        }, 5000);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (email.length === 0 || password.length === 0) {
            setErr(errMessage.concat('Fill all necessary fields'));
            errTimeout();
            return;
        }

        if (!email.includes('@')) {
            setErr(errMessage.concat('Email missing @'));
            errTimeout();
            return;
        }

        const user: Login = {
            email: email,
            password: password,
        };
        try {
            const res = await loginUser(user);
            console.log('Res?', res);
            setEmail('');
            setPassword('');
        } catch (e) {
            setErr(errMessage.concat('Error occured when logging in'));
            errTimeout();
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
                <button type="submit" className="loginbutton">
                    Login
                </button>
            </form>
        </div>
    );
};
