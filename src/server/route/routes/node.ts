import router from '../router';
import {Request, Response} from "express";
import {INode} from '../../domain/INode';
//import {IError} from '../../domain/IError';
//import db from '../../dbConfigs';

const dummyNode : INode = {
    id: 1,
    description: "Our first node",
    status: "ToDo",
    priority: "very important"
}

router.route('/node')
    .get((req: Request, res: Response) => {
        res.json(dummyNode);
    })
    .post(async (req: Request, res: Response) => {
        console.log("Receiving node...")
        const text: INode = req.body; //Might have to parse this
        console.log(text.description)
        const t = { text : "Node received. Thanks!"}
        res.status(200).json(t);
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
    .delete((req: Request, res: Response) => {
        res.status(404).json({message: "Not implemented"});
        // const {id}: {id: string} = req.body;
        // Test.deleteOne({_id: id}, {}, (err) => {
        //     if (err){
        //         const error: IError = {
        //             status: 500,
        //             message: "Resource can't be deleted!"
        //         }
        //         console.error(err);
        //         res.status(error.status).json(error);
        //     }
        //     else res.status(200).json({_id: id, text: "deleted successfully"});
        // })
    });

export default router;
