import { router } from '../router';
import { Request, Response } from 'express';
import { INode } from '../../../../types';
import { db } from '../../dbConfigs';

// Checks need to make sure the node is valid
const nodeCheck = (node: INode): boolean => {
    //Check that the node has all properties
    return Boolean(
        node.label &&
            node.status &&
            node.priority &&
            // eslint-disable-next-line no-prototype-builtins
            node.hasOwnProperty('x') &&
            // eslint-disable-next-line no-prototype-builtins
            node.hasOwnProperty('y')
    );
};

router.route('/node/:id').delete(async (req: Request, res: Response) => {
    console.log('Deleting node...');
    const id = req.params.id;
    await db.query('DELETE FROM node WHERE id = $1', [id]);
    res.status(200).json();
});

router
    .route('/node')
    .get(async (req: Request, res: Response) => {
        const q = await db.query('SELECT * FROM node', []);
        res.status(200).json(q.rows);
    })
    .post(async (req: Request, res: Response) => {
        console.log('Receiving node...');
        const text: INode = req.body; //Might have to parse this

        if (nodeCheck(text)) {
            const q = await db.query(
                'INSERT INTO node (label, status, priority, x, y) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [
                    text.label,
                    text.status,
                    text.priority,
                    Math.round(text.x),
                    Math.round(text.y),
                ]
            );
            res.status(200).json({ id: q.rows[0].id });
        } else {
            res.status(403).json({ message: 'Invalid node' });
        }
    })
    .put(async (req: Request, res: Response) => {
        const n: INode = req.body;
        console.log('Updating node...', n);

        if (nodeCheck(n) && n.id) {
            await db.query(
                'UPDATE node SET label = $1, status = $2, priority = $3, x = $4, y = $5 WHERE id = $6',
                [
                    n.label,
                    n.status,
                    n.priority,
                    Math.round(n.x),
                    Math.round(n.y),
                    n.id,
                ]
            );
            res.status(200).json();
        } else {
            console.error('Invalid data', n);
            res.status(403).json({ message: 'Invalid data' });
        }
    });

export { router as node };
