type Status = "Done" | "Doing" | "ToDo"

// Id of a node is optional since the id is created in the database
// so when sent to backend we don't give it any id

interface Position {
  x: number,
  y: number
}

export interface INode {
  description: string,
  status: Status,
  priority: string,
  id?: number, //Could there be a more specific ID than just number?
  position?: Position
}