import React, { useState } from 'react';
import { Registration } from '../../../../types';
import { createUser } from '../services/userService';

export const RegistrationForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errMessage, setErr] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (password !== confirm) {
            setErr('Passwords dont match!');
            setTimeout(() => {
                setErr('');
            }, 5000);
            return;
        }

        const user: Registration = {
            email,
            username,
            password,
        };

        const res = await createUser(user);
        console.log('Res?', res);
        setEmail('');
        setPassword('');
        setConfirm('');
        setUsername('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <p>{errMessage.length > 0 ? errMessage : null}</p>
                <div>
                    <label htmlFor="email">
                        <b>Email</b>
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
                    <label htmlFor="username">
                        <b>Username</b>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        name="username"
                        id="username"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
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
                        required
                    />
                </div>
                <div>
                    <label htmlFor="psw-repeat">
                        <b>Repeat Password</b>
                    </label>
                    <input
                        type="password"
                        placeholder="Repeat Password"
                        name="psw-repeat"
                        id="psw-repeat"
                        value={confirm}
                        onChange={({ target }) => setConfirm(target.value)}
                        required
                    />
                </div>

                <button type="submit" className="registerbutton">
                    Register
                </button>
            </form>
        </div>
    );
};
