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
import { INode, IProject } from '../../../types';
import { Projects } from './components/Projects';
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
    const [nodeText, setNodeText] = useState('');
    const [elements, setElements] = useState<Elements>([]);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(
        props.selectedProject || null
    );

    /**
     * Fetches the elements from a database
     */
    const getProjectsHook = (): void => {
        projectService.getAll('temp').then((projects) => {
            console.log('Projects', projects);
            setProjects(projects);
        });
    };
    useEffect(getProjectsHook, []);

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

    const selectProject = (projectId: number) => {
        const project = projects.find((p) => p.id === projectId);
        if (project) {
            setSelectedProject(project);
            setElements([]);

            nodeService.getAll(projectId).then((nodes) => {
                edgeService.getAll(projectId).then((edges) => {
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
    };

    if (!selectedProject) {
        return (
            <Projects
                projects={projects}
                setProjects={setProjects}
                setSelectedProject={setSelectedProject}
                selectProject={selectProject}
            />
        );
    }

    return (
        <div className="App">
            <Projects
                projects={projects}
                setProjects={setProjects}
                setSelectedProject={setSelectedProject}
                selectProject={selectProject}
            />
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
