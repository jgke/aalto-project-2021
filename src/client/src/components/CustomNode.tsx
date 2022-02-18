import React from 'react'
import { Handle, Position, NodeComponentProps } from 'react-flow-renderer';

const customNodeStyles = {
    background: '#9CA8B3',
    color: '#FFF',
    padding: 10,
    minWidth: '120px',
    display: 'flex',
};

export const CustomNodeComponent = ({ data }: NodeComponentProps): JSX.Element => {
    return (
        <div style={customNodeStyles}>
            <Handle type="target" position={Position.Left} style={{ borderRadius: 0}} />
            <div>{data.label}</div>
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                style={{ top: '30%', borderRadius: 0 }}
            />
        </div>
    );
};