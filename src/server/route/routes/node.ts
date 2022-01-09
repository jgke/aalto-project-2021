import { router } from '../router';
import { Request, Response } from 'express';
import { INode } from '../../../../types';
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
        console.log('Receiving node...');
        const text: INode = req.body; //Might have to parse this
        try {
            const q = await db.query(
                'INSERT INTO node (label, status, priority, x, y) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [text.label, text.status, text.priority, text.x, text.y]
            );
            res.status(200).json(q);
        } catch (e) {
            console.log('Invalid node', e);
            res.status(403).json();
        }
    })
    .put(async (req: Request, res: Response) => {
        const n: INode = req.body;
        console.log('Updating node...', n);
        const q = await db.query(
            'UPDATE node SET x = $1, y = $2 WHERE id = $3',
            [n.x, n.y, n.id]
        );
        res.status(200).json(q);
    });

export { router as node };
