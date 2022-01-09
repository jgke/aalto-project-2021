import { router } from '../router';
import { Request, Response } from 'express';
import { IEdge } from '../../../../types';
import { db } from '../../dbConfigs';

router.route('/edge/:id/').delete(async (req: Request, res: Response) => {
    try {
        await db.query('DELETE FROM edge WHERE id = $1', [req.params.id]);
        res.status(200).json();
    } catch (e) {
        console.log('DELETION FAILED!');
        console.log(e);
        res.status(404).json();
    }
});

router
    .route('/edge')
    .get(async (req: Request, res: Response) => {
        const q = await db.query('SELECT * FROM edge', []);

        res.json(q.rows);
    })
    .post(async (req: Request, res: Response) => {
        console.log('Receiving edge...', req.body);
        const text: IEdge = req.body; //Might have to parse this
        try {
            const duplicate = await db.query(
                'SELECT id FROM edge WHERE source_id = $1 AND target_id = $2',
                [text.source_id, text.target_id]
            );
            console.log(duplicate);
            if (duplicate.rowCount > 0) {
                res.status(403).json();
            }

            const q = await db.query(
                'INSERT INTO edge (source_id, target_id) VALUES ($1, $2) RETURNING id',
                [text.source_id, text.target_id]
            );
            console.log('What was the edge q?');
            res.status(200).json(q);
        } catch (e) {
            console.log(e);
            res.status(403).json();
        }
    })
    .put(async (req: Request, res: Response) => {
        const e: IEdge = req.body;
        if (e.id) {
            const q = await db.query(
                'UPDATE edge SET source_id = $1, target_id = $2 WHERE id = $3',
                [e.source_id, e.target_id, e.id]
            );
            res.status(200).json(q);
        } else {
            res.status(404).json();
        }
    });

export { router as edge };
