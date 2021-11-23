import * as n from "../services/nodeService" 
import * as t from "../types"

export const Nodething: React.FC = () => {
  const d: t.INode = {
    description: "Dummy node",
    priority: "Not very urgent",
    status: "ToDo",
    position: {x: 200, y: 200}
  }
  return (
    <div>
      <button onClick={() => n.getAll()}>Get nodes</button>
      <button onClick={() => n.sendNode(d)}>Add node</button>
      <button onClick={() => n.deleteNode('1')}>Delete node id 1</button>
    </div>
  )
}