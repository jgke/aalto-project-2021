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

router
    .route('/edge')
    .get(async (req: Request, res: Response) => {
        const q = await db.query('SELECT * FROM edge', []);

        res.json(q.rows);
    })
    .post(async (req: Request, res: Response) => {
        const edge: IEdge = req.body; //Might have to parse this

        await db.query(
            'DELETE FROM edge WHERE source_id = $1 AND target_id = $2',
            [edge.target_id, edge.source_id]
        );

        const q = await db.query(
            'INSERT INTO edge (source_id, target_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING source_id',
            [edge.source_id, edge.target_id]
        );

        if (q.rowCount > 0) {
            res.status(200).json();
            return;
        } else {
            res.status(403).json();
        }
    })
    .put((req: Request, res: Response) => {
        res.status(501).json({ message: 'Not implemented' });
    })
    .delete(async (req: Request, res: Response) => {
        res.status(501).json({ message: 'Not implemented' });
    });

export { router as edge };
