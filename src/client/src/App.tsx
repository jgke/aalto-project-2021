
import React, { useEffect, useState } from 'react';
import * as testService from './services/test'
import { Graph } from './components/Graph';
import { Elements, FlowElement, addEdge, removeElements, Edge, Connection } from 'react-flow-renderer';
import * as nodeService from './services/nodeService'
import * as t from './types'

const App : React.FC = () => {

	const [ text, setText ] = useState('')
	const [ name, setName ] = useState('')
	const [ nodeText, setNodeText ] = useState('')
	const [ elements, setElements ] = useState<Elements>([])

	interface FlowInstance {
		fitView: () => void;
	}
	
	const hook = () => {
		testService.getAll().then(response => {
			setName(response.username);
		});
	}

	/**
	 * Fetches the elements from a supposed database
	 */
	const getElementsHook = (): void => {
		nodeService.getAll().then(nodes => {
			const els: FlowElement[] = nodes.map(n => (
				{
					id: String(n.id),
					data: { label: <div>{n.description}</div>},
					position: {x: n.x, y: n.y}
				}
			))
			setElements(els)
		})
	}

	useEffect(hook, []);
	useEffect(getElementsHook, [])

	const postText = async (event: React.FormEvent) => {
		event.preventDefault();
		testService.create(text);
		setText('');
	}

	/**
	 * Creates a new node and stores it in the 'elements' React state. Nodes are stored in the database. 
	 */
	const createNode = async(): Promise<void> => {
		const newNode: FlowElement = {
			id: String(elements.length + 1),
			data: { label: nodeText },
			position: { x: 5 + elements.length * 10, y: 5 + elements.length * 10 },
		}
		const n: t.INode = {
			id: elements.length + 1,
			status: "ToDo",
			description: nodeText,
			priority: "Urgent",
			x: 5 + elements.length * 10,
			y: 5 + elements.length * 10 
		}
		try {
			await nodeService.sendNode(n)
		} catch (e) {
			console.log("Failed to add node in backend: ")
			console.log(e)
		}
		setNodeText('')
		setElements(elements.concat(newNode))
	}
	
	//Type for the edge does not need to be specified (interface Edge<T = any>)
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onConnect = (params: Edge<any> | Connection) => setElements( els => addEdge(params, els) )
	const onElementsRemove = (elementsToRemove: Elements) => {
		setElements((els) => removeElements(elementsToRemove, els))
	}
	const onLoad = (reactFlowInstance: FlowInstance) => reactFlowInstance.fitView();

	return (
		<div>
			<h2>Hello, {name}</h2>
			<form onSubmit={postText}>
				<div>
					title:
					<input id="text" type="text" value={text} name="Text"
						onChange={({ target }) => setText(target.value)} />
				</div>
				<button type="submit">post blog</button>
			</form>
		
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
				/>
			</div>

		</div>
	);
}

export default App; 
