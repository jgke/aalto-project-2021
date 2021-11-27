import axios from "axios";
import { IEdge } from "../types";
export const baseUrl = "/api/edge";

const getAll = async (): Promise<IEdge[]> => {
  const response = await axios.get<IEdge[]>(baseUrl);
  console.log(response.data);
  return response.data;
};

const sendEdge = async (edge: IEdge): Promise<{ msg: string }> => {
  const response = await axios.post(baseUrl, edge);
  console.log("Edge added", response.data);
  return response.data;
};

const deleteEdge = async (edge: IEdge): Promise<void> => {
  const response = await axios.post(baseUrl + '/delete', edge);
  if(response.status !== 200) {
    console.log(`Removing edge ${edge} failed`)
  }
  else {
    console.log("Edge removed", response.data)
  }
}

export { getAll, sendEdge, deleteEdge };
