import React, { FC } from 'react';
import { IProject, RootState, UserToken } from '../../../../types';
import { ProjectCard } from './ProjectCard';
import CSS from 'csstype';
import { ProjectForm } from './ProjectForm';
import { useSelector, useDispatch } from 'react-redux';
import * as projectReducer from '../reducers/projectReducer';

const projectListStyle: CSS.Properties = {
    display: 'flex',
    flexWrap: 'wrap',
};

interface ProjectProps {
    user: UserToken | null;
    projects?: IProject[];
}

export const Projects: FC<ProjectProps> = (props: ProjectProps) => {
    const dispatch = useDispatch();

    const projects =
        props.projects || useSelector((state: RootState) => state.project);

    const handleSubmit = async (project: IProject) => {
        dispatch(projectReducer.projectAdd(project));
    };

    return (
        <div className="project-container">
            <div className="project-form-container">
                <h3>Create a new project</h3>
                <ProjectForm
                    handleSubmit={handleSubmit}
                    saveMessage="New Project"
                    user={props.user}
                />
            </div>
            <div style={projectListStyle} className="project-list">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        user={props.user}
                    />
                ))}
            </div>
        </div>
    );
};
