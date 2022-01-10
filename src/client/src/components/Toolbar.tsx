import React, { PropsWithoutRef, useState } from 'react';
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
    return(
        <div>
            <h3>Add task</h3>
            <div>
                Text:{' '}
                <input
                    id="nodetext"
                    type="text"
                    value={nodeText}
                    onChange={({ target }) => setNodeText(target.value)}
                />
                <button id="button-toolbar" onClick={() => sendCreateNode(nodeText)}>Create</button>
            </div>
        </div>
    )
}