import React, { useEffect, useState } from 'react';
import { Graph } from './components/Graph';
import { Tag } from './components/Tag';
import { Elements } from 'react-flow-renderer';
import { INode, UserToken, ITag } from '../../../types';
import { Topbar } from './components/TopBar';
import './App.css';
import { Route, Routes } from 'react-router';
import { Registration } from './pages/Registration';
import { loginUser } from './services/userService';
import { LoginForm } from './components/LoginForm';
import { Navigate } from 'react-router-dom';

export const basicNode: INode = {
    status: 'ToDo',
    label: 'Text',
    priority: 'Urgent',
    x: 0,
    y: 0,
};

export const App: React.FC = () => {
    const [elements, setElements] = useState<Elements>([]);
    const [user, setUser] = useState<UserToken | null>(null);
    const [userParsed, setUserParsed] = useState<boolean>(false);
    const [tags, setTags] = useState<ITag[]>([])

    useEffect(() => {
        const loggedUserJson = window.localStorage.getItem('loggedGraphUser');
        if (loggedUserJson) {
            setUser(JSON.parse(loggedUserJson));
        }
        setUserParsed(true);
    }, []);

    // Wait for the parsing of localStorage
    if (!userParsed) {
        return <></>;
    }

    if (!user && !location.pathname.startsWith('/user')) {
        return <Navigate to="/user/login" />;
    }

    return (
        <div className="app">
            <div>
                <Topbar user={user} setUser={setUser} />
            </div>
            <Tag
                tags={tags}
                setTags={setTags}
            />
            <Routes>
                <Route
                    path="/"
                    element={
                        <Graph
                            elements={elements}
                            setElements={setElements}
                            className="graph"
                        />
                    }
                ></Route>
                <Route path="/user/register" element={<Registration />}></Route>
                <Route
                    path="/user/login"
                    element={
                        <LoginForm loginUser={loginUser} setUser={setUser} />
                    }
                ></Route>
            </Routes>
        </div>
    );
};
