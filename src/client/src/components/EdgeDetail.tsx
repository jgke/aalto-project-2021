import React, { FormEvent, useState } from 'react';
import { Connection, Edge, Elements, isNode } from 'react-flow-renderer';
import { IEdge, INode } from '../../../../types';
import { Form, Button } from 'react-bootstrap';

interface EdgeDetailProps {
    data: IEdge;
    elements: Elements;
    editMode: boolean;
    onEdgeUpdate: (edge: Edge<IEdge>, connection: Connection) => Promise<void>;
}

interface EdgeDetailEditProps {
    data: IEdge;
    elements: Elements;
    onEdgeUpdate: (edge: Edge<IEdge>, connection: Connection) => Promise<void>;
}

const EdgeDetailEdit = (props: EdgeDetailEditProps): JSX.Element => {
    const [source, setSource] = useState<string>(props.data.source_id);
    const [target, setTarget] = useState<string>(props.data.target_id);

    const handleSubmit = (event: FormEvent) => {
        const edge = props.elements.find(
            (el) => el.data.id === props.data.id
        ) as Edge<IEdge>;
        if (edge) {
            const connection: Connection = {
                source: String(source),
                target: String(target),
                sourceHandle: null,
                targetHandle: null,
            };
            props.onEdgeUpdate(edge, connection);
        }
        event.preventDefault();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formSourceId">
                <Form.Label>Source Node</Form.Label>
                <Form.Select
                    aria-label="Default select example"
                    defaultValue={source}
                    onChange={(e) => setSource(e.target.value)}
                >
                    <option>Select Source</option>
                    {props.elements.filter(isNode).map((el, i) => (
                        <option key={i} value={el.data.id}>
                            {el.data.label}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTargetId">
                <Form.Label>Target Node</Form.Label>
                <Form.Select
                    aria-label="Default select example"
                    defaultValue={target}
                    onChange={(e) => setTarget(e.target.value)}
                >
                    <option>Select Target</option>
                    {props.elements.filter(isNode).map((el, i) => (
                        <option key={i} value={el.data.id}>
                            {el.data.label}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};

export const EdgeDetail = (props: EdgeDetailProps): JSX.Element => {
    console.log(props.data);
    const source = props.elements.find(
        (el) => el.id === String(props.data.source_id)
    )?.data as INode;
    const target = props.elements.find(
        (el) => el.id === String(props.data.target_id)
    )?.data as INode;

    if (props.editMode) {
        return (
            <EdgeDetailEdit
                data={props.data}
                elements={props.elements}
                onEdgeUpdate={props.onEdgeUpdate}
            />
        );
    }

    return (
        <div>
            {source ? (
                <>
                    <h2>Source: {source.label}</h2>
                    <p>Status: {source.status}</p>
                    <p>Priority: {source.priority}</p>
                    <p>ID: {source.id}</p>
                </>
            ) : null}
            {target ? (
                <>
                    <h2>Target: {target.label}</h2>
                    <p>Status: {target.status}</p>
                    <p>Priority: {target.priority}</p>
                    <p>ID: {target.id}</p>
                </>
            ) : null}
            <h3>Edge ID: {props.data.id}</h3>
        </div>
    );
};
