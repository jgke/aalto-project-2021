import { router } from '../router';
import { Request, Response } from 'express';
import { INode } from '../../../../types';
//import {IError} from '../../domain/IError';
import { db } from '../../dbConfigs';

router
    .route('/node/:id')
    .get(async (req: Request, res: Response) => {
        const project_id = req.params.id;
        const q = await db.query('SELECT * FROM node WHERE project_id = $1', [project_id]);
        res.json(q.rows);
    })
    .delete(async (req: Request, res: Response) => {
        console.log('Deleting node...');
        const id = req.params.id;
        const q = await db.query('DELETE FROM node WHERE id = $1', [id]);
        res.status(200).json(q);
    });

router
    .route('/node')
    .post(async (req: Request, res: Response) => {
        console.log('Receiving node...');
        const text: INode = req.body; //Might have to parse this
        try {
            const q = await db.query(
                'INSERT INTO node (project_id, label, status, priority, x, y) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                [text.project_id, text.label, text.status, text.priority, text.x, text.y]
            );
            res.status(200).json(q);
        } catch (e) {
            /* console.error('Invalid node', e); */
            res.status(403).json();
        }
    })
    .put(async (req: Request, res: Response) => {
        const n: INode = req.body;
        console.log('Updating node...', n);
        if (
            n.label &&
            n.status &&
            n.priority &&
            n.x !== undefined &&
            n.y !== undefined &&
            n.id !== undefined
        ) {
            const q = await db.query(
                'UPDATE node SET label = $1, status = $2, priority = $3, x = $4, y = $5 WHERE id = $6',
                [n.label, n.status, n.priority, n.x, n.y, n.id]
            );
            res.status(200).json(q);
        } else {
            console.error('Invalid data', n);
            res.status(403).json();
        }
    })

export { router as node };
