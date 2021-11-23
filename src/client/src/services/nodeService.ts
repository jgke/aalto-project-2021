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

const deleteNode = async(id: string): Promise<{msg: string}> => {
  console.log("Going to delete node id ", id)
  try {
  const response = await axios.delete(`${baseUrl}/${id}`)
  console.log(response.data)
  return response.data
  } catch (e) {
    console.log("Deletion failed")
    console.log(e)
    return {msg: "Deletion failed"}
  }
}

export {
  getAll,
  sendNode,
  deleteNode
}