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
        console.log('Receiving edge...', req.body);
        const text: IEdge = req.body; //Might have to parse this

        if (!text.source_id || !text.target_id) {
            res.status(403).json().end();
            return;
        }

        if (text.source_id === text.target_id) {
            res.status(403).json().end();
            return;
        }

        const duplicateCheck = await db.query(
            'SELECT * FROM edge WHERE source_id = $1 AND target_id = $2',
            [text.source_id, text.target_id]
        );

        if (duplicateCheck.rowCount > 0) {
            res.status(403).json().end();
            return;
        }

        const q = await db.query(
            'INSERT INTO edge (source_id, target_id, project_id) VALUES ($1, $2, $3)',
            [text.source_id, text.target_id, text.project_id]
        );
        res.status(200).json(q);
    })
    .put((req: Request, res: Response) => {
        res.status(501).json({ message: 'Not implemented' });
    })
    .delete(async (req: Request, res: Response) => {
        res.status(501).json({ message: 'Not implemented' });
    });

export { router as edge };
