import React, { useEffect, useState } from 'react';
import * as testService from './services/test'
import { Graph } from './components/Graph';

function App() {
	const [ text, setText ] = useState('')
	const [ name, setName ] = useState('')

	const hook = () => {
		testService.getAll().then(response => {
			setName(response.username);
		});
	}
	useEffect(hook, []);

	const postText = async (event: React.FormEvent) => {
		event.preventDefault();
		testService.create(text);
		setText('');
	}

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

			<h2>This is a graph</h2>
			<Graph />
		</div>
	);
}

export default App; 
