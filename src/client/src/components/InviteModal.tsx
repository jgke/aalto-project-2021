import React, { FC, FormEvent, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { inviteUsers } from '../services/projectService';

interface InviteModalProps {
    projectId: number;
    show: boolean;
    handleClose: any;
}

export const InviteModal: FC<InviteModalProps> = (props: InviteModalProps) => {
    const [rowCount, setRowCount] = useState<number>(1);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const invited = [...form.querySelectorAll('input')].map(e => e.value)
        inviteUsers(props.projectId, invited);
        props.handleClose()
    };

    const handleClose = () => {
        setRowCount(1)
        props.handleClose();
    }

    return (
        <Modal show={props.show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>
                    Members
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit} className="project-form">
                <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                    <Form.Label>Invite users</Form.Label>
                    {[...Array(rowCount)].map((_, i) => 
                        <Form.Group key={i} id={'field-' + i} className="mb-3" controlId={'field' + i + 'Id'}>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                            />
                        </Form.Group>
                    )}
                    <div className="flex-space-between">
                        <Button variant="danger" onClick={() => setRowCount(rowCount - 1 || 1)}>
                            -
                        </Button>
    
                        <Button variant="primary" onClick={() => setRowCount(rowCount + 1)}>
                            +
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" type="submit">Invite</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
