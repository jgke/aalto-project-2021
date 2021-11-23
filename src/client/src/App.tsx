
import React, { useEffect, useState } from 'react';
import * as testService from './services/test'
import { Graph } from './components/Graph';
import { Elements, FlowElement, addEdge, removeElements, Edge, Connection } from 'react-flow-renderer';
import { Nodething } from './components/nodeModel'

function App() {

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
	const getElementsHook = () => {
		// TODO: Api call here 

		// Dummy elements
		setElements([
			{
				id: '1',
				// you can also pass a React component as a label
				data: { label: <div>Default Node</div> },
				position: { x: 200, y: 200 },
			},
			{
				id: '2',
				data: { label: 'Another default node' },
				position: { x: 50, y: 100 }
			},
			{ id: 'e2-1', source: '2', target: '1' }
		])
	}

	useEffect(hook, []);
	useEffect(getElementsHook, [])

	const postText = async (event: React.FormEvent) => {
		event.preventDefault();
		testService.create(text);
		setText('');
	}

	/**
	 * Creates a new node and stores it in the 'elements' React state. Disappears on page reload. 
	 */
	const createNode = (): void => {
		const newNode: FlowElement = {
			id: String(elements.length + 1),
			data: { label: nodeText },
			position: { x: 5 + elements.length * 10, y: 5 + elements.length * 10 },
		}
		setNodeText('')
		setElements(elements.concat(newNode))
	}

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
			<Nodething />
		
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
