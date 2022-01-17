import React, { useState } from 'react';
import { Login } from '../../../../types';
import { loginUser } from '../services/userService';
import '../Form.css'

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErr] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!email.includes('@')) {
            setErr('Incorrect email address');
            setTimeout(() => {
                setErr('');
            }, 5000);
            return;
        }

        const user: Login = {
            email: email,
            password: password,
        };

        const res = await loginUser(user);
        console.log('Res?', res);
        setEmail('');
        setPassword('');
    };

    return (
        <div className="form-box-login">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <p>{errMessage.length > 0 ? errMessage : null}</p>
                <div className="LoginForm">
                    <label htmlFor="email">
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="psw">
                    </label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name="psw"
                        id="psw"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        required
                    />
                </div>
                <button type="submit" className="loginbutton">
                    Login
                </button>
            </form>
        </div>
    );
};
