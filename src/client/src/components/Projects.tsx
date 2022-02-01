import React, { FormEvent, useState } from 'react';
import { IProject, RootState } from '../../../../types';
import * as projectService from '../services/projectService';
import { ProjectCard } from './ProjectCard';
import CSS from 'csstype';
import { ProjectForm } from './ProjectForm';
import { useSelector, useDispatch } from 'react-redux'
import * as projectReducer from '../reducers/projectReducer'

const projectListStyle: CSS.Properties = {
    display: 'flex',
    flexWrap: 'wrap',
};

export const Projects = () => {
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
            />
            <div style={projectListStyle}>
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                    />
                ))}
            </div>
        </div>
    );
};
