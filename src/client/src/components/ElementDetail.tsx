import React, { useEffect, useState } from 'react';
import { IEdge, INode } from '../../../../types';
import { isNodeData } from '../services/nodeService';
import { NodeDetail } from './NodeDetail';
import { BsXLg, BsPencilFill } from 'react-icons/bs';
import { Connection, Edge, Elements } from 'react-flow-renderer';
import { EdgeDetail } from './EdgeDetail';

interface ElementDetailProps {
    data: INode | IEdge | null;
    elements: Elements;
    onEdgeUpdate: (edge: Edge<IEdge>, connection: Connection) => Promise<void>;
    setSelectedData: React.Dispatch<React.SetStateAction<INode | IEdge | null>>;
}

export const ElementDetail = (props: ElementDetailProps): JSX.Element => {
    const [editMode, setEditMode] = useState<boolean>(false);

    useEffect(() => {
        setEditMode(false);
    }, [props.data]);

    if (!props.data) {
        return <></>;
    }

    return (
        <div className="detail-sidebar">
            <div className="detail-sidebar-topbar">
                <button
                    className="icon-button"
                    onClick={() => setEditMode(!editMode)}
                >
                    <BsPencilFill />
                </button>
                <button
                    className="icon-button"
                    onClick={() => props.setSelectedData(null)}
                >
                    <BsXLg />
                </button>
            </div>
            {isNodeData(props.data) ? (
                <NodeDetail editMode={editMode} data={props.data as INode} />
            ) : (
                <EdgeDetail
                    editMode={editMode}
                    data={props.data as IEdge}
                    elements={props.elements}
                    onEdgeUpdate={async (edge, connection) => {
                        await props.onEdgeUpdate(edge, connection);
                        setEditMode(false);
                    }}
                />
            )}
        </div>
    );
};
