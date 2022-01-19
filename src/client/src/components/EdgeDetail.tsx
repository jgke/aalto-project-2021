import React from 'react';
import { Elements } from 'react-flow-renderer';
import { IEdge, INode } from '../../../../types';

interface EdgeDetailProps {
    data: IEdge;
    elements: Elements;
    editMode: boolean;
}

export const EdgeDetail = (props: EdgeDetailProps): JSX.Element => {
    console.log(props.data);
    const source = props.elements.find(
        (el) => el.id === String(props.data.source_id)
    )?.data as INode;
    const target = props.elements.find(
        (el) => el.id === String(props.data.target_id)
    )?.data as INode;

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
