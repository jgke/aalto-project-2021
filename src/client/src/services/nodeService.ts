import axios from "axios"
import { INode } from "../types"
const baseUrl = "/api/node"

// Should be possible to give "getAll" a return type
const getAll = async () => {
  const node = await axios.get<INode>(baseUrl)
  console.log("Here is the node: ")
  console.log(node.data)
  return node.data
}

const sendNode = async() => {
  const node: INode = {
    description: "Node from front-end",
    id: 99,
    priority: "Not much",
    status: "ToDo"
  }
  const response = await axios.post(baseUrl, node)
  console.log(response.data)
  return response.data
}

export {
  getAll,
  sendNode
}