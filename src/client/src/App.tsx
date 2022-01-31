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
import { INode, IEdge, UserToken } from '../../../types';
import { Topbar } from './components/TopBar';

//import './App.css';

export const basicNode: INode = {
    status: 'ToDo',
    label: 'Text',
    priority: 'Urgent',
    x: 0,
    y: 0,
};

export const App: React.FC = () => {
    const [nodeText, setNodeText] = useState('');
    const [elements, setElements] = useState<Elements>([]);

    const [user, setUser] = useState<UserToken>({});

    /**
     * Fetches the elements from a database
     */
    useEffect(() => {
        const getElementsHook = async () => {
            let nodes: INode[];
            let edges: IEdge[];
            try {
                [nodes, edges] = await Promise.all([
                    nodeService.getAll(),
                    edgeService.getAll(),
                ]);
            } catch (e) {
                return;
            }

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
        };
        getElementsHook();
    }, []);

    useEffect(() => {
        const loggedUserJson = window.localStorage.getItem('loggedGraphUser');
        if (loggedUserJson) {
            setUser(JSON.parse(loggedUserJson));
        }
    }, []);

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
                try {
                    await nodeService.deleteNode(e);
                } catch (e) {
                    console.log('Error in node deletion', e);
                }
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

    const onNodeEdit = async (id: string, data: INode) => {
        setElements((els) =>
            els.map((el) => {
                if (el.id === id) {
                    el.data = data;
                }
                return el;
            })
        );

        await nodeService.updateNode(data);
    };

    return (
        <div className="App">
            <div>
                <Topbar {...user} />
            </div>
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
                    setElements={setElements}
                    onConnect={onConnect}
                    onElementsRemove={onElementsRemove}
                    onNodeEdit={onNodeEdit}
                    onEdgeUpdate={(o, s) =>
                        console.log('What are these?', o, s)
                    }
                />
            </div>
        </div>
    );
};
