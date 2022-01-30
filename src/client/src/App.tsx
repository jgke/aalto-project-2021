import React, { useEffect, useState } from 'react';
import { Graph } from './components/Graph';
import {
    Elements,
    removeElements,
    Node,
    isNode,
    isEdge,
    FlowElement,
    ArrowHeadType,
} from 'react-flow-renderer';
import * as projectService from './services/projectService';
import * as nodeService from './services/nodeService';
import * as edgeService from './services/edgeService';
import { INode, IEdge, UserToken, IProject, RootState } from '../../../types';
import { Projects } from './components/Projects';
import { Topbar } from './components/TopBar';
import { useSelector, useDispatch } from 'react-redux'
import * as projectReducer from './reducers/projectReducer'
import './App.css';

export const basicNode: INode = {
    status: 'ToDo',
    label: 'Text',
    priority: 'Urgent',
    x: 0,
    y: 0,
    project_id: 0,
};

interface AppProps {
    selectedProject?: IProject;
}

export const App = (props: AppProps) => {
    const dispatch = useDispatch()

    const projects = useSelector((state: RootState) => state.project.all.sort((a, b) => a.id > b.id ? 1 : -1))
    const selectedProject = useSelector((state: RootState) => state.project.selected)

    const [nodeText, setNodeText] = useState('');
    const [elements, setElements] = useState<Elements>([]);

    const [user, setUser] = useState<UserToken>({
        username: null,
        email: null,
        token: null,
    });

    /**
     * Fetches the elements from a database
     */
    useEffect(() => { dispatch(projectReducer.projectInit()) }, [dispatch])

    useEffect(() => { 
        if (selectedProject) {
            setElements([]);
    
            nodeService.getAll(selectedProject.id).then((nodes) => {
                edgeService.getAll(selectedProject.id).then((edges) => {
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
        }
    }, [selectedProject])

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
        if (!selectedProject) {
            return;
        }
        const n: INode = {
            status: 'ToDo',
            label: nodeText,
            priority: 'Urgent',
            x: 5 + elements.length * 10,
            y: 5 + elements.length * 10,
            project_id: selectedProject.id,
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

    if (!selectedProject) {
        return (
            <div>
                <Topbar {...user} />
                <Projects/>
            </div>
        );
    }

    return (
        <div className="App">
            <Topbar {...user} />
            <Projects/>
            <h2>{selectedProject.name}</h2>
            <div className="addTaskForm">
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
                    selectedProject={selectedProject}
                    elements={elements}
                    setElements={setElements}
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
