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

export { getAll, sendEdge };
