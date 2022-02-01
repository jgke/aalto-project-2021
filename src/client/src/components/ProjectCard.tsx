import React, { useState } from 'react';
import { IProject, UserToken } from '../../../../types';
import defaultBg from './../images/default.jpg';
import { BsThreeDotsVertical, BsXLg, BsPencilFill } from 'react-icons/bs';
import { ProjectForm } from './ProjectForm';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import CSS from 'csstype';
import { useDispatch } from 'react-redux'
import * as projectReducer from '../reducers/projectReducer'

interface ProjectCardProps {
    project: IProject;
    user: UserToken | null;
}

const dropdownButtonStyle: CSS.Properties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    borderRadius: '50%',
};

export const ProjectCard = (props: ProjectCardProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState<boolean>(false);

    const handleSubmit = async (project: IProject) => {
        dispatch(projectReducer.projectUpdate(project));
        setEditMode(false);
    };

    const deleteProject = async () => {
        if (props.project.id) {
            dispatch(projectReducer.projectDelete(props.project.id));
        }
    };

    let body;
    if (!editMode) {
        body = (
            <>
                <h5 className="card-title">{props.project.name}</h5>
                <p className="card-text">{props.project.description}</p>
            </>
        );
    } else {
        body = (
            <ProjectForm
                defaultProject={props.project}
                handleSubmit={handleSubmit}
                handleCancel={() => console.log('äg43g3')}
                user={props.user}
            />
        );
    }

    return (
        <div
            className={'card project-card' + (editMode ? ' edit' : ' view')}
            style={{ width: '20%', margin: 16 }}
            onClick={() =>
                props.project &&
                !editMode &&
                navigate('/project/' + props.project.id)
            }
        >
            <Dropdown onClick={(e) => e.stopPropagation()}>
                <Dropdown.Toggle
                    className="icon-button no-dropdown-arrow"
                    style={dropdownButtonStyle}
                >
                    <BsThreeDotsVertical />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item
                        href="#"
                        onClick={() => setEditMode(!editMode)}
                    >
                        <BsPencilFill /> Edit
                    </Dropdown.Item>
                    <Dropdown.Item href="#" onClick={() => deleteProject()}>
                        <BsXLg /> Delete
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <img
                className="card-img-top"
                src={defaultBg}
                alt="Card image cap"
                style={{ objectFit: 'cover', maxHeight: '100px' }}
            />
            <div className="card-body">{body}</div>
        </div>
    );
};
