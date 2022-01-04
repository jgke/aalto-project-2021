import React, { FormEvent, useState } from 'react';
import { Node } from 'react-flow-renderer';
import { INode } from '../../../../types';

interface NodeEditProps {
    node: Node<INode>;
    onNodeEdit: (id: string, data: INode) => void;
}

export const NodeEdit = (props: NodeEditProps): JSX.Element => {
    const data = props.node.data;
    if (data) {
        const [nodeName, setnodeName] = useState(data.label);

        const handleSubmit = (event: FormEvent) => {
            const newData = { ...data, ...{ label: nodeName } };

            props.onNodeEdit(props.node.id, newData);
            event.preventDefault();
        };

        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        style={{ width: '100%' }}
                        type="text"
                        value={nodeName}
                        onChange={(e) => {
                            setnodeName(e.target.value);
                        }}
                    />
                </form>
            </div>
        );
    }
    return <div></div>;
};
