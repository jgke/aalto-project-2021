import ReactFlow, { MiniMap, Controls, Background, ReactFlowProps } from 'react-flow-renderer';

const graphStyle = {
    height: 500, 
    width: 'auto', 
    border: '5px solid gray', 
    margin: 'auto', 
    backgroundColor: '#eeefff', 
    backgroundImage: 'linear-gradient(to bottom right, #00164f, #4e009c, #290066)'
}

export const Graph = (props: ReactFlowProps) => {
    const elements = props.elements
    const onConnect = props.onConnect
    const onElementsRemove = props.onElementsRemove
    const onLoad = props.onLoad
    return (
        <div style={graphStyle}>
            <ReactFlow 
                elements={elements}
                onConnect={onConnect} 
                onElementsRemove={onElementsRemove}
                onLoad={onLoad}>
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
                    maskColor='#69578c'
                />
            </ReactFlow>
        </div>
    )
}
