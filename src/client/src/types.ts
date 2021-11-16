
type Status = "Done" | "Doing" | "ToDo"

export interface INode {
  id: Number, //Could there be a more specific ID than just number?
  description: String,
  status: Status,
  priority: String
}