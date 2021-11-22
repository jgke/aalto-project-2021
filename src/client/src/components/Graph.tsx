import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';

/*
const elements = [
    {
        id: '1',
        type: 'input', // input node
        data: { label: 'Input Node' },
        position: { x: 250, y: 25 },
    },
    // default node
    {
        id: '2',
        // you can also pass a React component as a label
        data: { label: <div>Default Node</div> },
        position: { x: 100, y: 125 },
    },
    {
        id: '3',
        type: 'output', // output node
        data: { label: 'Output Node' },
        position: { x: 250, y: 250 },
    },
    // animated edge
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3' },
];
*/

const Graph = (props: any) => {
    const elements = props.elements
    return (
        <div style={{ height: 500, width: 'auto', border: '5px solid gray', margin: 'auto', backgroundColor: '#eeefff', backgroundImage: 'linear-gradient(to bottom right, #00164f, #4e009c, #290066)' }}>
            <ReactFlow elements={elements} snapGrid={[15, 15]}>
                <Controls />
                <Background color="#aaa" gap={16} />
                <MiniMap
                    nodeStrokeColor={(n) => {
                        if (n.style?.background) return n.style.background.toString();
                        if (n.type === 'input') return '#0041d0';
                        if (n.type === 'output') return '#ff0072';
                        if (n.type === 'default') return '#1a192b';

                        return '#eee';
                    }}
                    nodeColor={(n) => {
                        if (n.style?.background) return n.style.background.toString();

                        return '#fff';
                    }}
                    nodeBorderRadius={2}
                />
            </ReactFlow>
        </div>
    )
}
export { Graph };