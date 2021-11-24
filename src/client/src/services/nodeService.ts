import axios from "axios"
import { INode } from "../types"
export const baseUrl = "/api/node"

// Should be possible to give "getAll" a return type
const getAll: () => Promise<INode[]> = async () => {
  const node = await axios.get<INode[]>(baseUrl)
  console.log(node.data)
  return node.data
}

//What is the actual type? We are sending a JSON to the backend and
//then return an object
const sendNode = async(node: INode): Promise<{msg: string}> => {
  /* const node: INode = {
    description: description,
    priority: "Not much",
    status: "ToDo"
  } */
  const response = await axios.post(baseUrl, node)
  console.log("Node added", response.data)
  return response.data
}

export {
  getAll,
  sendNode
}