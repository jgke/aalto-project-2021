import router from '../router';
import {Request, Response} from "express";
import {INode} from '../../domain/INode';
//import {IError} from '../../domain/IError';
import { db } from '../../dbConfigs';

router.route('/node/:id')
    .delete(async(req: Request, res: Response) => {
        console.log("Deleting node...")
        const id = req.params.id
        await db.query("DELETE FROM edge WHERE source_id = $1 OR target_id = $2;", [id, id])
        const q = await db.query("DELETE FROM node WHERE id = $1", [id])
        res.status(200).json(q)
    })

router.route('/node')
    .get(async(req: Request, res: Response) => {
        const q = await db.query("SELECT * FROM node", [])
        res.json(q.rows)
    })
    .post(async (req: Request, res: Response) => {
        console.log("Receiving node...")
        const text: INode = req.body; //Might have to parse this
        const q = await db.query("INSERT INTO node (description, status, priority, x, y, id) VALUES ($1, $2, $3, $4, $5, $6)", [text.description, text.status, text.priority, text.x, text.y, text.id])
        res.status(200).json(q);
        
    })
    .put((req: Request, res: Response) => {
        res.status(404).json({message: "Not implemented"});
        // const {id, text}: {id: string, text: string} = req.body;
        // Test.updateOne({_id: id}, {text}, {}, (err, test) => {
        //     if (err){
        //         const error: IError ={
        //             status: 500,
        //             message: "It can't be updated at this moment!"
        //         }
        //         console.error(err);
        //         res.status(error.status).json(error);
        //     }
        //     else res.status(200).json({_id: id, text, ...test});
        // })
    })
    .delete(async(req: Request, res: Response) => {
        res.status(404).json({message: "Not implemented"})
    });

export default router;
