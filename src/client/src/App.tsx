import React, { useEffect, useState } from 'react';
import { Graph } from './components/Graph';
import { Elements, addEdge, removeElements, Edge, Connection, isNode, isEdge } from 'react-flow-renderer';
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
		// console.log("hook")
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
	useEffect(getElementsHook, [nodeText])

	/**
	 * Creates a new node and stores it in the 'elements' React state. Nodes are stored in the database. 
	 */
	const createNode = (): void => {
		const n: t.INode = {
			status: "ToDo",
			description: nodeText,
			priority: "Urgent",
			x: 5 + elements.length * 10,
			y: 5 + elements.length * 10 
		}
		
		nodeService.sendNode(n)
			.then( returnId => {
				if(returnId){
					console.log("Returned id:", returnId)
					console.log("Adding node:", {
						id: returnId,
						data: { label: nodeText },
						position: { x: 5 + elements.length * 10, y: 5 + elements.length * 10 }
					})
					setElements(elements.concat({
						id: returnId,
						data: { label: nodeText },
						position: { x: 5 + elements.length * 10, y: 5 + elements.length * 10 }
					}))
				} else {
					console.log("No returnId returned")
				}
					
			})
			.catch ( (e: Error) => {
				console.log("Failed to add node in backend: ")
				console.log(e)
			})
			
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

	const onElementsRemove = (elementsToRemove: Elements) => {
		elementsToRemove.forEach((e) => {
			if(isNode(e)){
				nodeService.deleteNode(e)
			}
			else if(isEdge(e)) {
				edgeService.deleteEdge(e).catch( (e: Error) => console.log("Error when deleting edge", e) )
			}
		}
		)
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
			<div className="graph">
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
