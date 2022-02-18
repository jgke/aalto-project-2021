import React from 'react'
import { Handle, Position, NodeComponentProps } from 'react-flow-renderer';

const customNodeStyles = {
    background: '#fff',
    borderColor: '#1a192b',
    borderRadius: '3px',
    borderStyle: 'solid',
    borderWidth: '1px',
    color: '#222',
    fontSize: '12px',
    padding: '10px',
    minWidth: '150px'
};

export const CustomTaskNode = ({ data }: NodeComponentProps): JSX.Element => {
    
    const sourceHandleStyle = {
        width: '40%',
        height: '110%',
        borderRadius: '5%'
    }
    
    const targetHandleStyle = {
        width: '40%',
        height: '110%',
        borderRadius: '5%',
        background: 'red',
        opacity: 0.5,
    }

    return (
        <div style={customNodeStyles}>
            <Handle type="source" position={Position.Left} style={sourceHandleStyle} />
            <div style={{textAlign: 'center'}}>{data.label}</div>
            <Handle
                type="target"
                position={Position.Right}
                style={targetHandleStyle}
            />
        </div>
    );
};