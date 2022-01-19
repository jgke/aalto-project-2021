import React, { FormEvent, useState } from 'react';
import { IProject } from '../../../../types';
import defaultBg from './../images/default.jpg';
import { BsThreeDotsVertical, BsXLg, BsPencilFill } from 'react-icons/bs';
import { ProjectForm } from './ProjectForm';
import * as projectService from '../services/projectService';
import { Dropdown } from 'react-bootstrap';
import CSS from 'csstype';

interface ProjectCardProps {
    project: IProject;
    setProjects: React.Dispatch<React.SetStateAction<IProject[]>>;
    setSelectedProject: React.Dispatch<React.SetStateAction<IProject | null>>
    selectProject: (projectId: number) => void;
}

const dropdownButtonStyle: CSS.Properties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    borderRadius: '50%'
}

export const ProjectCard = (props: ProjectCardProps) => {
    const [editMode, setEditMode] = useState<boolean>(false);

    const handleSubmit = async (project: IProject) => {
        await projectService.updateProject(project);
        props.setProjects((projects) => projects.map(p => p.id === project.id ? project : p));
        setEditMode(false);
    }

    const deleteProject = async() => {
        if (props.project.id) {
            await projectService.deleteProject(props.project.id);
            props.setProjects((projects) => projects.filter(p => p.id !== props.project.id));
            props.setSelectedProject(project => project?.id === props.project.id ? null : project)
        }
    }

    let body;
    if (!editMode) {
        body = <>
            <h5 className="card-title">{props.project.name}</h5>
            <p className="card-text">{props.project.description}</p>
        </>;
    } else {
        body = <ProjectForm defaultProject={props.project} handleSubmit={handleSubmit} handleCancel={() => console.log('äg43g3')}/>;
    } 

    return (
        <div className={'card project-card' + (editMode ? ' edit' : ' view')} style={{width: '20%', margin: 16}}
            onClick={() => props.project && !editMode && props.selectProject(props.project.id)}>
            <Dropdown onClick={(e) => e.stopPropagation()}>
                <Dropdown.Toggle className="icon-button no-dropdown-arrow" style={dropdownButtonStyle}>
                    <BsThreeDotsVertical />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item href="#" onClick={() => setEditMode(!editMode)}>
                        <BsPencilFill /> Edit
                    </Dropdown.Item>
                    <Dropdown.Item href="#" onClick={() => deleteProject()}>
                        <BsXLg /> Delete
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <img className="card-img-top" src={defaultBg} alt="Card image cap" style={{objectFit: 'cover', maxHeight: '100px'}} />
            <div className="card-body">
                {body}
            </div>
        </div>
    );
};