import { router } from '../router';
import { Request, Response } from 'express';
import { IEdge } from '../../../../types';
import { db } from '../../dbConfigs';
import { checkProjectPermission } from '../../helper/permissionHelper';

router
    .route('/edge/:source/:target')
    .delete(async (req: Request, res: Response) => {
        const source = req.params.source;
        const target = req.params.target;


        const edgeQuery = await db.query(
            'SELECT project_id FROM edge WHERE source_id = $1 AND target_id = $2',
            [source, target]
        );

        if (edgeQuery.rowCount === 0) {
            return res.status(403).json({ message: 'Edge does not exist' });
        }

        const permissions = await checkProjectPermission(req, edgeQuery.rows[0].project_id)
        if (!permissions.edit) {
            return res.status(401).json({ message: 'No permission' });
        }

        await db.query(
            'DELETE FROM edge WHERE source_id = $1 AND target_id = $2',
            [source, target]
        );
        res.status(200).json();
    });

router.route('/edge/:id').get(async (req: Request, res: Response) => {
    const project_id = parseInt(req.params.id);

    const permissions = await checkProjectPermission(req, project_id)
    if (!permissions.view) {
        return res.status(401).json({ message: 'No permission' });
    }

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

        const permissions = await checkProjectPermission(req, newEdge.project_id)
        if (!permissions.edit) {
            return res.status(401).json({ message: 'No permission' });
        }

        if (source === target) {
            res.status(400)
                .json({ message: 'Source and target were the same' })
                .end();
            return;
        }

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
