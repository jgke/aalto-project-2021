import { router } from '../router';
import { Request, Response } from 'express';
import { IEdge } from '../../../../types';
import { db } from '../../dbConfigs';

router
    .route('/edge/:source/:target')
    .delete(async (req: Request, res: Response) => {
        try {
            const source = req.params.source;
            const target = req.params.target;
            await db.query(
                'DELETE FROM edge WHERE source_id = $1 AND target_id = $2',
                [source, target]
            );
            res.status(200).json();
        } catch (e) {
            console.log('DELETION FAILED!');
            console.log(e);
            res.status(404).json();
        }
    });

router
    .route('/edge/:id')
    .get(async (req: Request, res: Response) => {
        const project_id = req.params.id;
        const q = await db.query('SELECT * FROM edge WHERE project_id = $1', [project_id]);
        res.json(q.rows);
    })

router
    .route('/edge')
    .post(async (req: Request, res: Response) => {
        console.log('Receiving edge...', req.body);
        const text: IEdge = req.body; //Might have to parse this
        try {
            const q = await db.query(
                'INSERT INTO edge (project_id, source_id, target_id) VALUES ($1, $2, $3)',
                [text.project_id, text.source_id, text.target_id]
            );
            res.status(200).json(q);
        } catch (e) {
            console.log(e);
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
