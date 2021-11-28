import React, { useEffect, useState } from 'react';
import { Graph } from './components/Graph';
import { Elements, addEdge, removeElements, Edge, Connection, Node, isEdge } from 'react-flow-renderer';
import * as nodeService from './services/nodeService'
import * as edgeService from "./services/edgeService"
import * as t from './types'

const App : React.FC = () => {

	const [ nodeText, setNodeText ] = useState('')
	const [ elements, setElements ] = useState<Elements>([])

	interface FlowInstance {
		fitView: () => void;
	}

	/**
	 * Fetches the elements from a database
	 */
	const getElementsHook = (): void => {
		nodeService.getAll().then(nodes => {
			edgeService.getAll().then(edges => {
				const nodeElements: Elements = nodes.map(n => (
					{
						id: String(n.id),
						data: { label: n.description },
						position: {x: n.x, y: n.y}
					}
				))
	
				const edgeElements: Elements = edges.map(e => (
					{
						id: String(e.source_id) + "-" + String(e.target_id), 
						source: String(e.source_id), 
						target: String(e.target_id)
					}
				))
				
				setElements(nodeElements.concat(edgeElements));
			});
		});
	};
	useEffect(getElementsHook, [])

	/**
	 * Creates a new node and stores it in the 'elements' React state. Nodes are stored in the database. 
	 */
	const createNode = async (): Promise<void> => {
		const n: t.INode = {
			status: "ToDo",
			description: nodeText,
			priority: "Urgent",
			x: 5 + elements.length * 10,
			y: 5 + elements.length * 10 
		}
		try {
			const returnId = await nodeService.sendNode(n)

			setElements(elements.concat({
				id: returnId,
				data: { label: nodeText },
				position: { x: 5 + elements.length * 10, y: 5 + elements.length * 10 }
			}))

			} catch { (e: Error) => {
				console.log("Failed to add node in backend: ")
				console.log(e)
			}}

			/*setElements(elements.concat({
				id: String(elements.length + 1),
				data: { label: nodeText },
				position: { x: 5 + elements.length * 10, y: 5 + elements.length * 10 },
				connectable: true
			}))*/
		setNodeText('')
	}

	//Type for the edge does not need to be specified (interface Edge<T = any>)
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onConnect = (params: Edge<any> | Connection) => {
		if (params.source && params.target) {
			setElements( (els) => addEdge(params, els) )
			
			edgeService.sendEdge({ 
				source_id: Number(params.source), 
				target_id: Number(params.target)
			});
		} else {
			console.log("source or target of edge is null, unable to send to db");
		}
	}


	const onElementsRemove = async(elementsToRemove: Elements) => {
		window.alert("Delete the selected items?")
		//eslint-disable-next-line @typescript-eslint/no-explicit-any
		elementsToRemove.forEach( (e: any) => {    // Could be Edge or Node
			if(isEdge(e)) {
				edgeService.deleteEdge(e).catch( (e: Error) => console.log("Error when deleting edge", e) )
			}
		})
		setElements((els) => removeElements(elementsToRemove, els))
	}

	const onLoad = (reactFlowInstance: FlowInstance) => reactFlowInstance.fitView();

	return (
		<div>		
			<h2>Tasks</h2>
			<div>
				<h3>Add task</h3>
				<div>
					Text: <input id='nodetext' type='text' value={nodeText} onChange={ ({ target }) => setNodeText(target.value)}/>
					<button onClick={createNode}>Add</button>
				</div>
			</div>
			<div>
				<Graph
					elements={elements}
					onConnect={onConnect}
					onElementsRemove={onElementsRemove}
					onLoad={onLoad}
					onEdgeUpdate={(o, s) => console.log("What are these?", o, s)}
				/>
			</div>

		</div>
	);
}

export default App; 
