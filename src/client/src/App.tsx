import React, { useEffect, useState } from 'react';
import { Graph } from './components/Graph';
import {
    Elements,
    addEdge,
    removeElements,
    Edge,
    Node,
    Connection,
    isNode,
    isEdge,
    FlowElement,
    ArrowHeadType,
    updateEdge,
} from 'react-flow-renderer';
import * as nodeService from './services/nodeService';
import * as edgeService from './services/edgeService';
import { INode, IEdge } from '../../../types';
import { ElementDetail } from './components/ElementDetail';
import { isNodeData } from './services/nodeService';
import './App.css';

export const App: React.FC = () => {
    const [nodeText, setNodeText] = useState('');
    const [elements, setElements] = useState<Elements>([]);
    const [selectedData, setSelectedData] = useState<INode | IEdge | null>(
        null
    );

    interface FlowInstance {
        fitView: () => void;
    }

    /**
     * Fetches the elements from a database
     */
    const getElementsHook = (): void => {
        nodeService.getAll().then((nodes) => {
            edgeService.getAll().then((edges) => {
                const nodeElements: Elements = nodes.map((n) => ({
                    id: String(n.id),
                    data: n,
                    position: { x: n.x, y: n.y },
                }));
                // Edge Types: 'default' | 'step' | 'smoothstep' | 'straight'
                const edgeElements: Elements = edges.map((e) => ({
                    id: String(e.source_id) + '-' + String(e.target_id),
                    source: String(e.source_id),
                    target: String(e.target_id),
                    type: 'straight',
                    arrowHeadType: ArrowHeadType.ArrowClosed,
                    data: e,
                }));

                setElements(nodeElements.concat(edgeElements));
            });
        });
    };
    useEffect(getElementsHook, []);

    /**
     * Creates a new node and stores it in the 'elements' React state. Nodes are stored in the database.
     */
    const createNode = async (): Promise<void> => {
        const n: INode = {
            status: 'ToDo',
            label: nodeText,
            priority: 'Urgent',
            x: 5 + elements.length * 10,
            y: 5 + elements.length * 10,
        };
        const returnId: string | undefined = await nodeService.sendNode(n);
        if (returnId) {
            n.id = String(returnId);
            const b: Node<INode> = {
                id: String(returnId),
                data: n,
                position: { x: n.x, y: n.y },
            };
            setElements(elements.concat(b));
        }
        setNodeText('');
    };

    const onConnect = async (params: Edge<IEdge> | Connection) => {
        if (params.source && params.target) {
            //This does not mean params is an edge but rather a Connection

            const id = await edgeService.sendEdge({
                source_id: params.source,
                target_id: params.target,
            });

            const edge: IEdge = {
                source_id: params.source,
                target_id: params.target,
                id: id,
            };

            const b: Edge<IEdge> = {
                id: String(params.source) + '-' + String(params.target),
                type: 'straight',
                source: params.source,
                target: params.target,
                arrowHeadType: ArrowHeadType.ArrowClosed,
                data: edge,
            };

            setElements((els) => addEdge(b, els));
        } else {
            console.log(
                'source or target of edge is null, unable to send to db'
            );
        }
    };

    const onEdgeUpdate = async (
        edge: Edge<IEdge>,
        connection: Connection
    ): Promise<void> => {
        if (connection.source && connection.target) {
            const newEdgeData: IEdge = {
                id: edge.data?.id,
                source_id: connection.source,
                target_id: connection.target,
            };
            await edgeService.updateEdge(newEdgeData);
            setElements((els) =>
                updateEdge(
                    { ...edge, ...{ data: newEdgeData } },
                    connection,
                    els
                )
            );

            // Update detail sidebar if id matches
            if (selectedData && selectedData.id === edge.data?.id) {
                setSelectedData(newEdgeData || null);
            }
        }
    };

    /**
     * Ordering function for elements, puts edges first and nodes last. Used in
     * onElementsRemove.
     */
    const compareElementsEdgesFirst = (
        a: FlowElement,
        b: FlowElement
    ): number => {
        if (isNode(a)) {
            if (isNode(b)) return 0;
            else return 1;
        } else {
            // a is an Edge
            if (isNode(b)) return -1;
            else return 0;
        }
    };

    /**
     * Prop for Graph component, called when nodes or edges are removed. Called also
     * for adjacent edges when a node is removed.
     */
    const onElementsRemove = async (elementsToRemove: Elements) => {
        // Must remove edges first to prevent referencing issues in database
        const sortedElementsToRemove = elementsToRemove.sort(
            compareElementsEdgesFirst
        );
        for (const e of sortedElementsToRemove) {
            // Close detail sidebar if id matches
            if (selectedData?.id === e.data.id) {
                setSelectedData(null);
            }

            if (isNode(e)) {
                try {
                    await nodeService.deleteNode(e);
                } catch (e) {
                    console.log('Error in node deletion', e);
                }
            } else if (isEdge(e)) {
                await edgeService
                    .deleteEdge(e.data)
                    .catch((e: Error) =>
                        console.log('Error when deleting edge', e)
                    );
            }
        }

        setElements((els) => removeElements(elementsToRemove, els));
    };

    const onElementClick = (event: React.MouseEvent, element: FlowElement) => {
        console.log(event, element);
        if (isNodeData(element.data)) {
            setSelectedData(element.data as INode);
        } else {
            setSelectedData(element.data as IEdge);
        }
    };

    const onLoad = (reactFlowInstance: FlowInstance) =>
        reactFlowInstance.fitView();

    return (
        <div className="App">
            <h2>Tasks</h2>
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
                    <button onClick={createNode}>Add</button>
                </div>
            </div>
            <div className="graph">
                <Graph
                    elements={elements}
                    onConnect={onConnect}
                    onElementsRemove={onElementsRemove}
                    onLoad={onLoad}
                    onElementClick={onElementClick}
                    onEdgeUpdate={onEdgeUpdate}
                />
            </div>
            <ElementDetail
                data={selectedData}
                elements={elements}
                setSelectedData={setSelectedData}
                onEdgeUpdate={onEdgeUpdate}
            />
        </div>
    );
};
