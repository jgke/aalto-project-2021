import React, { MouseEvent as ReactMouseEvent } from 'react';
import * as nodeService from '../services/nodeService';
import { INode } from '../../../../types';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    ReactFlowProps,
    Node,
    Elements,
} from 'react-flow-renderer';
import { NodeEdit } from './NodeEdit';

const graphStyle = {
    height: '100%',
    width: 'auto',
    border: '5px solid gray',
    margin: 'auto',
    backgroundColor: '#eeefff',
    backgroundImage:
        'linear-gradient(to bottom right, #00164f, #4e009c, #290066)',
};

const onNodeDragStop = async (
    x: React.MouseEvent,
    node: Node<INode>
): Promise<void> => {
    console.log('Update node called', node.data);
    if (node.data) {
        const n: INode = node.data;
        n.x = node.position.x;
        n.y = node.position.y;
        await nodeService.updateNode(n);
    } else {
        console.log('INode data not found');
    }
};

interface GraphProps {
    setElements: React.Dispatch<React.SetStateAction<Elements>>;
    onNodeEdit: (id: string, data: INode) => void;
}

export const Graph = (props: ReactFlowProps & GraphProps): JSX.Element => {
    const elements = props.elements;
    const setElements = props.setElements;
    const onConnect = props.onConnect;
    const onElementsRemove = props.onElementsRemove;
    const onLoad = props.onLoad;

    const onNodeDoubleClick = (
        event: ReactMouseEvent<Element, MouseEvent>,
        node: Node<INode>
    ) => {
        if (node.data) {
            const form = <NodeEdit node={node} onNodeEdit={props.onNodeEdit} />;

            setElements((els) =>
                els.map((el) => {
                    if (el.id === node.id) {
                        el.data = {
                            ...el.data,
                            label: form,
                        };
                    }
                    return el;
                })
            );
            console.log(elements);
        }
    };

    return (
        <div style={graphStyle}>
            <ReactFlow
                elements={elements}
                onConnect={onConnect}
                onElementsRemove={onElementsRemove}
                //onEdge update does not remove edge BUT changes the mouse icon when selecting an edge
                // so it works as a hitbox detector
                onEdgeUpdate={props.onEdgeUpdate}
                onLoad={onLoad}
                onNodeDragStop={onNodeDragStop}
                onNodeDoubleClick={onNodeDoubleClick}
            >
                <Controls />
                <Background color="#aaa" gap={16} />
                <MiniMap
                    nodeStrokeColor={(n) => {
                        if (n.style?.background)
                            return n.style.background.toString();
                        if (n.type === 'input') return '#0041d0';
                        if (n.type === 'output') return '#ff0072';
                        if (n.type === 'default') return '#1a192b';

                        return '#eee';
                    }}
                    nodeColor={(n) => {
                        if (n.style?.background)
                            return n.style.background.toString();

                        return '#fff';
                    }}
                    nodeBorderRadius={2}
                    maskColor="#69578c"
                />
            </ReactFlow>
        </div>
    );
};
