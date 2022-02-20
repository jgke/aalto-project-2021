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
    //TODO: try useImperativeHandle 
    //const [largeHandles, setLargeHandles] = useState(false)
    
    const sourceHandleStyle = {
        borderRadius: '100%',
    }
    
    const targetHandleStyle = {
        borderRadius: '100%',
    }

    return (
        <div style={customNodeStyles}>
            <Handle type="target" position={Position.Top} style={sourceHandleStyle} />
            <div style={{textAlign: 'center'}}>{data.label}</div>
            <Handle
                type="source"
                position={Position.Bottom}
                style={targetHandleStyle}
            />
        </div>
    );
};