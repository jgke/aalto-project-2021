import React from 'react';
import { IProject, RootState, UserToken } from '../../../../types';
import { ProjectCard } from './ProjectCard';
import CSS from 'csstype';
import { ProjectForm } from './ProjectForm';
import { useSelector, useDispatch } from 'react-redux'
import * as projectReducer from '../reducers/projectReducer'

const projectListStyle: CSS.Properties = {
    display: 'flex',
    flexWrap: 'wrap',
};

export const Projects = ({ user } : {user: UserToken | null}) => {
    const dispatch = useDispatch()

    const projects = useSelector((state: RootState) => state.project)

    const handleSubmit = async (project: IProject) => {
        dispatch(projectReducer.projectAdd(project))
    };

    return (
        <div>
            <h3>Create a new project</h3>
            <ProjectForm
                handleSubmit={handleSubmit}
                saveMessage="New Project"
                user={user}
            />
            <div style={projectListStyle}>
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        user={user}
                    />
                ))}
            </div>
        </div>
    );
};
