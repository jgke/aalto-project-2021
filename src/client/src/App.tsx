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
} from 'react-flow-renderer';
import * as nodeService from './services/nodeService';
import * as edgeService from './services/edgeService';
import { INode, IEdge } from '../../../types';
//import './App.css';

const App: React.FC = () => {
    const [nodeText, setNodeText] = useState('');
    const [elements, setElements] = useState<Elements>([]);

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

    const onConnect = (params: Edge<IEdge> | Connection) => {
        if (params.source && params.target) {
            //This does not mean params is an edge but rather a Connection

            const b: Edge<IEdge> = {
                id: String(params.source) + '-' + String(params.target),
                type: 'straight',
                source: params.source,
                target: params.target,
                arrowHeadType: ArrowHeadType.ArrowClosed,
            };

            setElements((els) => addEdge(b, els));

            edgeService.sendEdge({
                source_id: params.source,
                target_id: params.target,
            });
        } else {
            console.log(
                'source or target of edge is null, unable to send to db'
            );
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
            if (isNode(e)) {
                await nodeService
                    .deleteNode(e)
                    .catch((e: Error) => console.log('Error deleting Node', e));
            } else if (isEdge(e)) {
                await edgeService
                    .deleteEdge(e)
                    .catch((e: Error) =>
                        console.log('Error when deleting edge', e)
                    );
            }
        }

        setElements((els) => removeElements(elementsToRemove, els));
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
                    onEdgeUpdate={(o, s) =>
                        console.log('What are these?', o, s)
                    }
                />
            </div>
        </div>
    );
};

//Seems like this needs to be a default export
export default App;
