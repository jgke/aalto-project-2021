import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { ToolbarProps } from '../../../../types';

export type ToolbarHandle = {
    setConnectText: (newText: string) => void;
};

// This looks very confusing because of Typescript
export const Toolbar = forwardRef((props: ToolbarProps, ref): JSX.Element => {
    const [nodeText, setNodeText] = useState('');
    const nodeHidden = props.nodeHidden;
    const [connectText, setConnectText] = useState('Connect');
    const createNode = props.createNode;
    const reverseConnectState = props.reverseConnectState;
    const layoutWithDagre = props.layoutWithDagre;
    const hideNode = props.setNodeHidden;
    const forceDirected = props.forceDirected;

    useImperativeHandle(ref, () => {
        return {
            setConnectText,
        };
    });
    /**
     * Calls createNode from App.tsx and clears state
     */
    const sendCreateNode = (nodeText: string) => {
        setNodeText('');
        return createNode(nodeText);
    };

    /* The following input field will be removed or re-positioned at some point */
    return (
        <div className="toolbar">
            <input
                id="nodetext"
                type="text"
                placeholder="Text"
                value={nodeText}
                onChange={({ target }) => setNodeText(target.value)}
            />
            <button
                id="createBtn"
                className="button-toolbar"
                onClick={() => sendCreateNode(nodeText)}
            >
                Create
            </button>
            <button
                id="connectBtn"
                className="button-toolbar"
                onClick={reverseConnectState}
            >
                {connectText}
            </button>
            <button
                className="button-layout"
                id="dagreTB"
                onClick={async () => await layoutWithDagre('TB')}
            >
                Vertical Layout
            </button>
            <button
                className="button-layout"
                id="dagreLR"
                onClick={async () => await layoutWithDagre('LR')}
            >
                Horizontal Layout
            </button>
            <button
                className="button-layout"
                id="forceDirected"
                onClick={async () => await forceDirected()}
            >
                Force-directed
            </button>
            <div>
                <input
                    type="checkbox"
                    className="checkbox-toolbar"
                    checked={nodeHidden}
                    onChange={(evt) => hideNode(evt.target.checked)}
                /> Hide done tasks
            </div>
        </div>
    );
});
