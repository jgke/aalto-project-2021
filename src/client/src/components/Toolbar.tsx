import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { ToolbarProps } from '../../../../types';

export type ToolbarHandle = {
    setCreateText: (newText: string) => void;
    setConnectText: (newText: string) => void;
};

// This looks very confusing because of Typescript
export const Toolbar = forwardRef((props: ToolbarProps, ref): JSX.Element => {
    const [createText,  setCreateText]  = useState('Create');
    const [connectText, setConnectText] = useState('Connect');
    // The following two change Graph.tsx's states
    const reverseConnectState = props.reverseConnectState;
    const reverseCreateState = props.reverseCreateState;
    const layoutWithDagre = props.layoutWithDagre;
    const forceDirected = props.forceDirected;

    useImperativeHandle(ref, () => {
        return {
            setCreateText, setConnectText
        };
    });

    /* The following input field will be removed or re-positioned at some point */
    return (
        <div className="toolbar">
            <button
                id="createBtn"
                className="button-toolbar"
                onClick={reverseCreateState}
            >
                {createText}
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
        </div>
    );
});
