import React, { FormEvent, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { IProject } from '../../../../types';

interface ProjectFormProps {
    defaultProject?: IProject;
    saveMessage?: string;
    handleCancel?: () => void;
    handleSubmit: (project: IProject) => Promise<void>;
}

export const ProjectForm = (props: ProjectFormProps) => {
    const [name, setName] = useState<string>(props.defaultProject?.name || '');
    const [description, setDescription] = useState<string>(
        props.defaultProject?.description || ''
    );

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const project: IProject = {
            name,
            description,
            owner_id: 'temp',
            id: props.defaultProject?.id || 0,
        };
        props.handleSubmit(project);
    };

    return (
        <div>
            <Form onSubmit={handleSubmit} className="project-form">
                <Form.Group className="mb-3" controlId="nameId">
                    <Form.Label>Project name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        defaultValue={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formSourceId">
                    <Form.Label>Project name</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Enter Description"
                        defaultValue={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>

                <div className="flex-space-between">
                    <Button variant="primary" type="submit">
                        {props.saveMessage || 'Save'}
                    </Button>

                    {props.handleCancel && (
                        <Button variant="danger">Cancel</Button>
                    )}
                </div>
            </Form>
        </div>
    );
};
