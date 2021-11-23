
type Status = "Done" | "Doing" | "ToDo"

interface Position {
  x: number,
  y: number
}

export interface INode {
  id?: number, //Could there be a more specific ID than just number?
  description: string,
  status: Status,
  priority: string,
  position?: Position
}