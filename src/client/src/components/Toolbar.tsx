import React, { useState } from 'react';
import { ToolbarProps } from '../../../../types';


export const Toolbar = (props: ToolbarProps) => {
    const [nodeText, setNodeText] = useState('');
    const createNode = props.createNode

    /** 
     * Calls createNode from App.tsx and clears state
     */
    const sendCreateNode = (nodeText: string) => {
        setNodeText('')
        return createNode(nodeText)
    }
    
    /* The following input field will be removed or re-positioned at some point */
    return(
        <div className="toolbar">
            <input
                id="nodetext"
                type="text"
                placeholder='Text'
                value={nodeText}
                onChange={({ target }) => setNodeText(target.value)}
            />
            <button id="button-toolbar" onClick={() => sendCreateNode(nodeText)}>Create</button>
        </div>
    )
}