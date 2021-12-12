
type Status = "Done" | "Doing" | "ToDo"

export interface INode {
  id?: number, //Could there be a more specific ID than just number?
  description: string,
  status: Status,
  priority: string,
  x: number,
  y: number
}