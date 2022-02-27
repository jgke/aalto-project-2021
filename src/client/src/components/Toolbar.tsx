import React, { useState } from 'react';
import { ToolbarProps } from '../../../../types';

export const Toolbar = (props: ToolbarProps): JSX.Element => {
    const [nodeText, setNodeText] = useState('');
    const nodeHidden = props.nodeHidden;
    const createNode = props.createNode;
    const layoutWithDagre = props.layoutWithDagre;
    const hideNode = props.setNodeHidden;
    const forceDirected = props.forceDirected;

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
            <label>Hide done tasks:</label>
            <div>
                <input
                    type="checkbox"
                    checked={nodeHidden}
                    onChange={(evt) => hideNode(evt.target.checked)}
                />
            </div>
            <button
                className="button-layout"
                id="forceDirected"
                onClick={async () => await forceDirected()}
            >
                Force-directed
            </button>
        </div>
    );
};
