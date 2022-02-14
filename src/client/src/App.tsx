import React, { useEffect, useState } from 'react';
import { Graph } from './components/Graph';
import { Toolbar } from './components/Toolbar';
import { Tag } from './components/Tag';
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
import * as layoutService from './services/layoutService';
import * as tagService from './services/tagService';
import { INode, IEdge, ITag } from '../../../types';
import './App.css';

export const basicNode: INode = {
    status: 'ToDo',
    label: 'Text',
    priority: 'Urgent',
    x: 0,
    y: 0,
};

export const App: React.FC = () => {
    const [elements, setElements] = useState<Elements>([]);
    const [tags, setTags] = useState<ITag[]>([])

    //calls nodeService.updateNode for all nodes
    const updateNodes = async (): Promise<void> => {
        for (const el of elements) {
            if (isNode(el)) {
                const node: INode = el.data;

                if (node) {
                    node.x = el.position.x;
                    node.y = el.position.y;

                    await nodeService.updateNode(node);
                }
            }
        }
    };

    const layoutWithDagre = async (direction: string) => {
        //applies the layout
        setElements(layoutService.dagreLayout(elements, direction));

        //sends updated node positions to backend
        await updateNodes();
    };

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
                data: e,
            }));
            setElements(nodeElements.concat(edgeElements));
        };
        getElementsHook();

        refreshTagList();
    }, []);

    /**
     * Creates a new node and stores it in the 'elements' React state. Nodes are stored in the database.
     */
    const createNode = async (nodeText: string): Promise<void> => {
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
    };

    const onConnect = async (params: Edge<IEdge> | Connection) => {
        if (params.source && params.target) {
            //This does not mean params is an edge but rather a Connection

            const edge: IEdge = {
                source_id: params.source,
                target_id: params.target,
            };
            const b: Edge<IEdge> = {
                id: String(params.source) + '-' + String(params.target),
                type: 'straight',
                source: params.source,
                target: params.target,
                arrowHeadType: ArrowHeadType.ArrowClosed,
                data: edge,
            };

            const success = await edgeService.sendEdge(edge);
            if (success) {
                // Filter out the edge that will be replaced, if there is one
                setElements((els) =>
                    els.filter(
                        (e) =>
                            isNode(e) ||
                            !(
                                e.target === params.source &&
                                e.source === params.target
                            )
                    )
                );
                setElements((els) => addEdge(b, els));
            }
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

    const createTag = async (tagLabel: string): Promise<void> => {
        const t: ITag = {
            id: 0,
            label: tagLabel,
            color: 'red',
        };
        const returnId: number | undefined = await tagService.sendTag(t);
        if (returnId) {
            t.id = returnId;
            //setTags(tags.concat(t));
            await refreshTagList();
        }
    };

    const onTagEdit = async (data: ITag) => {
        setTags((tgs) =>
            tgs.map((tg) => {
                if (tg.id === data.id) {
                    tg = data;
                }
                return tg;
            })
        );

        await tagService.updateTag(data);
    }

    const onTagRemove = async (id: number) => {
        const idx = tags.findIndex( t => t.id === id );
        if(idx >= 0){
            console.log('deleting tag: ', tags[idx]);
            await tagService.deleteTag(id);
            //setTags(tags.splice(idx, 1));
            await refreshTagList();
        } else {
            console.log('could not find tag with id: ', id);
        }
    }

    const refreshTagList = async () => {
        try {
            const tagList = await tagService.getAll();
            // TODO: limit the number of tags returned from tagService
            console.log(tagList[0].label)
            setTags(tagList.slice(0, 49));
        } catch (e) {
            console.log('Error in tagService.getAll', e);
        }
    }

    return (
        <div className="App">
            <Tag
                data={tags}
                createTag={createTag}
                onTagEdit={onTagEdit}
                onTagRemove={onTagRemove}
            />
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
                    className="graph"
                />
            </div>
            <Toolbar
                createNode={createNode}
                layoutWithDagre={layoutWithDagre}
            />
        </div>
    );
};
