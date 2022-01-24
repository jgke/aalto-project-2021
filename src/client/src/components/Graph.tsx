import React, {
    useEffect,
    MouseEvent as ReactMouseEvent,
    useState,
    useRef,
} from 'react';
import { IEdge, INode, IProject } from '../../../../types';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    ReactFlowProps,
    Node,
    Elements,
    ReactFlowProvider,
    Edge,
    Connection,
    addEdge,
    ArrowHeadType,
} from 'react-flow-renderer';
import { NodeEdit } from './NodeEdit';
import * as nodeService from '../services/nodeService';
import * as edgeService from '../services/edgeService';

const graphStyle = {
    height: '100%',
    width: 'auto',
    border: '5px solid gray',
    margin: 'auto',
    backgroundColor: '#eeefff',
    backgroundImage:
        'linear-gradient(to bottom right, #00164f, #4e009c, #290066)',
};

export interface GraphProps {
    setElements: React.Dispatch<React.SetStateAction<Elements>>;
    onNodeEdit: (id: string, data: INode) => void;
    selectedProject: IProject | null;
}

interface FlowInstance {
    fitView: () => void;
    project: (pos: { x: number; y: number }) => { x: number; y: number };
}

export const Graph = (props: ReactFlowProps & GraphProps): JSX.Element => {
    if (!props.selectedProject) {
        return <></>;
    }
    const selectedProject = props.selectedProject;
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] =
        useState<FlowInstance | null>(null);

    const elements = props.elements;
    const setElements = props.setElements;
    const onElementsRemove = props.onElementsRemove;

    const onLoad = (_reactFlowInstance: FlowInstance) => {
        _reactFlowInstance.fitView();
        setReactFlowInstance(_reactFlowInstance);
    };

    const onNodeDragStop = async (
        x: React.MouseEvent,
        node: Node<INode>
    ): Promise<void> => {
        if (node.data) {
            const n: INode = {
                ...node.data,
                ...{ x: node.position.x, y: node.position.y },
            };

            setElements((els) =>
                els.map((el) => {
                    const node = el as Node<INode>;
                    if (node.position && el.id === node.id) {
                        node.position = {
                            x: node.position.x,
                            y: node.position.y,
                        };
                    }
                    return el;
                })
            );
            await nodeService.updateNode(n);
        } else {
            console.log('INode data not found');
        }
    };

    const onNodeDoubleClick = (
        event: ReactMouseEvent<Element, MouseEvent>,
        node: Node<INode>
    ) => {
        if (node.data && node.id !== 'TEMP') {
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
        }
    };

    // handle what happens on mousepress press
    const handleMousePress = (event: MouseEvent) => {
        const onEditDone = async (data: INode, node: Node) => {
            const n: INode = {
                status: 'ToDo',
                label: data.label,
                priority: 'Urgent',
                x: node.position.x,
                y: node.position.y,
                project_id: props.selectedProject?.id || 0,
            };

            const returnId: string | undefined = await nodeService.sendNode(n);

            if (returnId) {
                n.id = returnId;
                setElements((els) =>
                    els.map((el) => {
                        if (el.id === node.id) {
                            const pos = (el as Node).position;
                            el = {
                                ...el,
                                ...{
                                    id: String(returnId),
                                    data: n,
                                    position: { x: pos.x, y: pos.y },
                                    draggable: true,
                                },
                            };
                        }
                        return el;
                    })
                );
            }
        };

        if (event.ctrlKey && reactFlowInstance && reactFlowWrapper?.current) {
            const reactFlowBounds =
                reactFlowWrapper.current.getBoundingClientRect();
            let position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            position = { x: Math.floor(position.x), y: Math.floor(position.y) };
            console.log(position);

            const tempExists =
                elements.findIndex((el) => el.id === 'TEMP') >= 0;

            const b: Node = {
                id: 'TEMP',
                data: {},
                position,
                draggable: false,
            };
            b.data.label = (
                <NodeEdit
                    node={b}
                    onNodeEdit={async (_, data) => await onEditDone(data, b)}
                />
            );

            setElements((els) =>
                tempExists
                    ? els.map((el) => (el.id === 'TEMP' ? b : el))
                    : els.concat(b)
            );
        }
    };

    useEffect(() => {
        // attach the event listener
        document.addEventListener('click', handleMousePress);

        // remove the event listener
        return () => {
            document.removeEventListener('click', handleMousePress);
        };
    }, [handleMousePress]);

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
                project_id: selectedProject.id,
            });
        } else {
            console.log(
                'source or target of edge is null, unable to send to db'
            );
        }
    };

    return (
        <ReactFlowProvider>
            <div
                className="flow-wrapper"
                style={graphStyle}
                ref={reactFlowWrapper}
            >
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
        </ReactFlowProvider>
    );
};
