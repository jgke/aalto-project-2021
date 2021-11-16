import router from '../router';
import {Request, Response} from "express";
import {INode} from '../../domain/INode'

const nodeUrl = 'node'

router.route(`/${nodeUrl}`)
  .get((req: Request, res: Response) => {
    const node: INode = {
      description: "Our first node",
      id: 1,
      priority: "Very importanté",
      status: "ToDo"
    }
    res.json(node)
  })