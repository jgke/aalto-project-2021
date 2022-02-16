import { router } from '../router';
import { Request, Response } from 'express';
import { IEdge } from '../../../../types';
import { db } from '../../dbConfigs';

router
    .route('/edge/:source/:target')
    .delete(async (req: Request, res: Response) => {
        const source = req.params.source;
        const target = req.params.target;
        await db.query(
            'DELETE FROM edge WHERE source_id = $1 AND target_id = $2',
            [source, target]
        );
        res.status(200).json();
    });

router.route('/edge/:id').get(async (req: Request, res: Response) => {
    const project_id = req.params.id;
    const q = await db.query('SELECT * FROM edge WHERE project_id = $1', [
        project_id,
    ]);
    res.json(q.rows);
});

router
    .route('/edge')
    .post(async (req: Request, res: Response) => {
        const newEdge: IEdge = req.body;
        const source = newEdge.source_id;
        const target = newEdge.target_id;

        const oldEdge = await db.query(
            'SELECT * FROM edge WHERE (source_id=$1 AND target_id=$2) OR (source_id=$2 AND target_id=$1)',
            [source, target]
        );

        if (oldEdge.rowCount > 0) {
            //if opposite edge exists, flip it around
            const oppositeEdge = await db.query(
                'UPDATE edge SET source_id=$1, target_id=$2 WHERE source_id=$2 AND target_id=$1 RETURNING *',
                [source, target]
            );

            if (oppositeEdge.rowCount > 0) {
                res.status(200).json();
            } else {
                res.status(403).json({ message: 'no duplicate edges allowed' });
            }
        } else {
            await db.query(
                'INSERT INTO edge (source_id, target_id, project_id) VALUES ($1, $2, $3)',
                [source, target, newEdge.project_id]
            );

            res.status(200).json();
        }
    })
    .put((req: Request, res: Response) => {
        res.status(501).json({ message: 'Not implemented' });
    })
    .delete(async (req: Request, res: Response) => {
        res.status(501).json({ message: 'Not implemented' });
    });

export { router as edge };
