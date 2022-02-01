import React, { useEffect, useState } from 'react';
import { Graph } from './components/Graph';
import { Elements } from 'react-flow-renderer';
import { INode, UserToken } from '../../../types';
import { Projects } from './components/Projects';
import { Topbar } from './components/TopBar';
import { useDispatch } from 'react-redux'
import * as projectReducer from './reducers/projectReducer'
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
    project_id: 0,
};

export const App = () => {
    const dispatch = useDispatch()

    const [elements, setElements] = useState<Elements>([]);
    const [user, setUser] = useState<UserToken | null>(null);
    const [userParsed, setUserParsed] = useState<boolean>(false);

    /**
     * Fetches the elements from a database
     */
    useEffect(() => { dispatch(projectReducer.projectInit()) }, [dispatch])

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
            <Routes>
                <Route path="/" element={<Projects/>}></Route>
                <Route
                    path="/project/:id"
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
