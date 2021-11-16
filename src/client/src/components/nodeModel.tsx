import * as n from "../services/nodeService" 

export const Nodething: React.FC = () => {

  return (
    <div>
      <button onClick={() => n.getAll()}>Get nodes</button>
      <button onClick={() => n.sendNode()}>Add node</button>
    </div>
  )
}