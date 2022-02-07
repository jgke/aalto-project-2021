import React, {
    useEffect,
    MouseEvent as ReactMouseEvent,
    useState,
    useRef,
} from 'react';
import * as nodeService from '../services/nodeService';
import { INode } from '../../../../types';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    ReactFlowProps,
    Node,
    Elements,
    ReactFlowProvider,
} from 'react-flow-renderer';
import { NodeEdit } from './NodeEdit';

const graphStyle = {
    height: '100%',
    width: 'auto',
    margin: 'auto',
    backgroundColor: '#eeefff',
    backgroundImage:
        'linear-gradient(to bottom right, #00164f, #4e009c, #290066)',
};

export interface GraphProps {
    setElements: React.Dispatch<React.SetStateAction<Elements>>;
    onNodeEdit: (id: string, data: INode) => void;
}

interface FlowInstance {
    fitView: () => void;
    project: (pos: { x: number; y: number }) => { x: number; y: number };
}

export const Graph = (props: ReactFlowProps & GraphProps): JSX.Element => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] =
        useState<FlowInstance | null>(null);

    const elements = props.elements;
    const setElements = props.setElements;
    const onConnect = props.onConnect;
    const onElementsRemove = props.onElementsRemove;
    const [nodeHidden, setNodeHidden] = useState(false);

    const handleHidingNode = (
        useEffect(() => {
            setElements((els) =>
                els.map((el) => {
                    if (el.data === 'Urgent') {
                        el.isHidden = nodeHidden;
                    }
        
                    return el;
                })
            );
        }, [nodeHidden, setElements]))

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
                isHidden: false,
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
