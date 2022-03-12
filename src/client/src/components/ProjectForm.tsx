import React, { FC, FormEvent, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { IProject, UserToken } from '../../../../types';

interface ProjectFormProps {
    defaultProject?: IProject;
    saveMessage?: string;
    handleCancel?: () => void;
    handleSubmit: (project: IProject) => Promise<void>;
    user: UserToken | null;
}

export const ProjectForm: FC<ProjectFormProps> = (props: ProjectFormProps) => {
    const [name, setName] = useState<string>(props.defaultProject?.name || '');
    const [description, setDescription] = useState<string>(
        props.defaultProject?.description || ''
    );
    const [public_view, setPublicView] = useState<boolean>(
        props.defaultProject?.public_view || false
    );
    const [public_edit, setPublicEdit] = useState<boolean>(
        props.defaultProject?.public_edit || false
    );

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (props.user?.id) {
            const project: IProject = {
                name,
                description,
                owner_id: props.user.id,
                id: props.defaultProject?.id || 0,
                public_view,
                public_edit,
            };
            setName('');
            setDescription('');
            setPublicView(false);
            setPublicEdit(false);

            props.handleSubmit(project);
        }
    };

    return (
        <div>
            <Form onSubmit={handleSubmit} className="project-form">
                <Form.Group id="name-field" className="mb-3" controlId="nameId">
                    <Form.Label>Project name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group
                    id="description-field"
                    className="mb-3"
                    controlId="formSourceId"
                >
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Enter Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group
                    id="public-view-field"
                    className="mb-3"
                    controlId="publicViewId"
                >
                    <Form.Check
                        type="switch"
                        label="Enable public viewing"
                        defaultChecked={public_view}
                        onChange={(e) => setPublicView(e.target.checked)}
                    />
                </Form.Group>
                <Form.Group
                    id="public-edit-field"
                    className="mb-3"
                    controlId="publicViewId"
                >
                    <Form.Check
                        type="switch"
                        label="Enable public editing"
                        defaultChecked={public_edit}
                        onChange={(e) => setPublicEdit(e.target.checked)}
                    />
                </Form.Group>

                <div id="project-button-row" className="flex-space-between">
                    <Button variant="primary" type="submit">
                        {props.saveMessage || 'Save'}
                    </Button>

                    {props.handleCancel && (
                        <Button variant="danger" onClick={props.handleCancel}>
                            Cancel
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
};
