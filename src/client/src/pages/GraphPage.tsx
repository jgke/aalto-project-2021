import React, { useEffect, useState } from 'react';
import { Graph } from '../components/Graph';
import { ElementDetail } from '../components/ElementDetail';
import {
    IEdge,
    INode,
    IProject,
    ProjectPermissions,
    RootState,
} from '../../../../types';
import {
    ArrowHeadType,
    Edge,
    Elements,
    FlowElement,
    isEdge,
    isNode,
    Node,
} from 'react-flow-renderer';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import * as nodeService from '../services/nodeService';
import * as edgeService from '../services/edgeService';
import * as projectService from '../services/projectService';

export const GraphPage = (): JSX.Element => {
    const { id } = useParams();

    // Sidebar related data
    const [selectedElement, setSelectedElement] = useState<
        Node<INode> | Edge<IEdge> | null
    >(null);
    const [selectedDataType, setSelectedDataType] = useState<
        'Node' | 'Edge' | null
    >(null);
    const [selectedProject, setSelectedProject] = useState<
        IProject | undefined
    >(undefined);
    const [permissions, setPermissions] = useState<ProjectPermissions>({
        view: false,
        edit: false,
    });

    const DefaultNodeType = 'default';

    const [elements, setElements] = useState<Elements>([]);

    const projects = useSelector((state: RootState) => state.project);

    useEffect(() => {
        const project = projects.find((p) => p.id === parseInt(id || ''));
        if (project) {
            setSelectedProject(project);
        } else if (id !== undefined) {
            projectService
                .getProject(parseInt(id))
                .then((project) => setSelectedProject(project))
                .catch(() => setSelectedProject(undefined));
        } else {
            setSelectedProject(undefined);
        }
    }, [id]);

    useEffect(() => {
        if (selectedProject) {
            projectService
                .getProjectPermissions(parseInt(id || ''))
                .then((permissions) => setPermissions(permissions));
        } else {
            setPermissions({ view: false, edit: false });
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedProject) {
            const getElementsHook = async () => {
                let nodes: INode[];
                let edges: IEdge[];
                try {
                    [nodes, edges] = await Promise.all([
                        nodeService.getAll(selectedProject.id),
                        edgeService.getAll(selectedProject.id),
                    ]);
                } catch (e) {
                    return;
                }

                const nodeElements: Elements = nodes.map((n) => ({
                    id: String(n.id),
                    type: DefaultNodeType,
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
            };
            getElementsHook();
        }
    }, [selectedProject]);

    useEffect(() => {
        const element = elements.find((e) => e.id === selectedElement?.id);
        if (element) {
            element && setSelectedElement(element);
        } else if (!element) {
            closeSidebar();
        }
    }, [elements]);

    const onElementClick = (event: React.MouseEvent, element: FlowElement) => {
        if (isNode(element)) {
            setSelectedElement(element);
            setSelectedDataType('Node');
        } else if (isEdge(element)) {
            setSelectedElement(element);
            setSelectedDataType('Edge');
        }
    };

    const closeSidebar = () => {
        setSelectedElement(null);
        setSelectedDataType(null);
    };

    return (
        <>
            <Graph
                elements={elements}
                setElements={setElements}
                selectedProject={selectedProject}
                onElementClick={onElementClick}
                DefaultNodeType={DefaultNodeType}
                permissions={permissions}
            />
            <ElementDetail
                element={selectedElement}
                type={selectedDataType}
                elements={elements}
                setElements={setElements}
                closeSidebar={closeSidebar}
                permissions={permissions}
            />
        </>
    );
};
