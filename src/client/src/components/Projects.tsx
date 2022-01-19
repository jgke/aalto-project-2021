import React, { FormEvent, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { IProject } from '../../../../types';
import * as projectService from '../services/projectService';
import { ProjectCard } from './ProjectCard';
import CSS from 'csstype';
import { ProjectForm } from './ProjectForm';

interface ProjectsProps {
    projects: IProject[];
    setProjects: React.Dispatch<React.SetStateAction<IProject[]>>;
    setSelectedProject: React.Dispatch<React.SetStateAction<IProject | null>>
    selectProject: (projectId: number) => void;
}


const projectListStyle: CSS.Properties = {
    display: 'flex',
    flexWrap: 'wrap'
};

export const Projects = (props: ProjectsProps) => {
    const handleSubmit = async (project: IProject) => {
        project.id = await projectService.sendProject(project);
        if (project.id) {
            props.setProjects(props.projects.concat(project));
        } else {
            console.error('Could not create project');
        }
    }

    return (
        <div>
            <h3>Create a new project</h3>
            <ProjectForm handleSubmit={handleSubmit} saveMessage='New Project'/>
            <div style={projectListStyle}>
                {props.projects.map(project => <ProjectCard key={project.id} project={project} setProjects={props.setProjects} setSelectedProject={props.setSelectedProject} selectProject={props.selectProject} />)}
            </div>
        </div>
    );
};