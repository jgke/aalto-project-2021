import React from 'react';
import { INode } from '../../../../types';

interface NodeDetailProps {
    data: INode;
    editMode: boolean;
}

export const NodeDetail = (props: NodeDetailProps): JSX.Element => {
    return (
        <div>
            <h2>{props.data.label}</h2>
            <p>Status: {props.data.status}</p>
            <p>Priority: {props.data.priority}</p>
            <p>ID: {props.data.id}</p>
        </div>
    );
};
