import router from '../router';
import { Request, Response } from 'express';
import { INode } from '../../domain/INode';
//import {IError} from '../../domain/IError';
import { db } from '../../dbConfigs';

router.route('/node/:id').delete(async (req: Request, res: Response) => {
    console.log('Deleting node...');
    const id = req.params.id;
    const q = await db.query('DELETE FROM node WHERE id = $1', [id]);
    res.status(200).json(q);
});

router
    .route('/node')
    .get(async (req: Request, res: Response) => {
        const q = await db.query('SELECT * FROM node', []);
        res.json(q.rows);
    })
    .post(async (req: Request, res: Response) => {
        const text: INode = req.body; //Might have to parse this
        try {
            const q = await db.query(
                'INSERT INTO node (description, status, priority, x, y) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [text.description, text.status, text.priority, text.x, text.y]
            );
            res.status(200).json(q);
        } catch (e) {
            console.log('Invalid node', e);
            res.status(403).json();
        }
    })
    .put((req: Request, res: Response) => {
        res.status(404).json({ message: 'Not implemented' });
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
    .delete(async (req: Request, res: Response) => {
        res.status(404).json({ message: 'Not implemented' });
    });

export default router;
