import { router } from '../router';
import { Request, Response } from 'express';
import { IProject } from '../../../../types';
//import {IError} from '../../domain/IError';
import { db } from '../../dbConfigs';
import { checkProjectPermission } from '../../helper/permissionHelper';

/* let projects: Array<IProject> = [{id: '1', name: 'test'}]; */

router
    .route('/project/:id')
    .get(async (req: Request, res: Response) => {
        const project_id = parseInt(req.params.id);

        const permissions = await checkProjectPermission(req, project_id);

        if (!permissions.view) {
            return res.status(401).json({ message: 'No permission' });
        }
        const q = await db.query('SELECT * FROM project WHERE id = $1', [
            project_id,
        ]);
        res.json(q.rows[0]);
    })
    .delete(async (req: Request, res: Response) => {
        if (!req.token || !req.user) {
            return res.status(401).json({ error: 'token missing or invalid' });
        }
        const id = req.params.id;
        const ownerId = req.user.id;

        const q = await db.query(
            'DELETE FROM project WHERE id = $1 AND owner_id = $2',
            [id, ownerId]
        );
        res.status(200).json(q);
        //the latter part is only for testing with array
        /* const idx = projects.findIndex( p => p.id === id );
        if(idx >= 0){
            console.log('deleting project: ', projects[idx]);
            projects.splice(idx, 1);
            res.status(200).json({ message: 'deleted project'})
        } else {
            console.log('could not find project with id: ', id);
        } */
    });

router
    .route('/project/:id/permission')
    .get(async (req: Request, res: Response) => {
        const project_id = parseInt(req.params.id);

        const permissions = await checkProjectPermission(req, project_id);
        res.json(permissions);
    });

router
    .route('/project')
    .get(async (req: Request, res: Response) => {
        if (!req.token || !req.user) {
            return res.status(401).json({ error: 'token missing or invalid' });
        }

        const ownerId = req.user.id;
        const q = await db.query('SELECT * FROM project WHERE owner_id = $1', [
            ownerId,
        ]);
        res.json(q.rows);
        /* console.log('projects: ', projects);
        res.json(projects); */
    })
    .post(async (req: Request, res: Response) => {
        if (!req.token || !req.user) {
            return res.status(401).json({ error: 'token missing or invalid' });
        }

        const project: IProject = req.body;

        const ownerId = req.user.id;
        if (project.owner_id !== ownerId) {
            return res.status(401).json({ error: 'invalid owner id' });
        }

        try {
            const q = await db.query(
                'INSERT INTO project (name, owner_id, description, public_view, public_edit) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [
                    project.name,
                    project.owner_id,
                    project.description,
                    project.public_view,
                    project.public_edit,
                ]
            );
            res.status(200).json(q.rows[0]);
            /* console.log('adding project: ', project);
            projects.push(project) */
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Invalid project', e);
            res.status(403).json();
        }
    })
    .put(async (req: Request, res: Response) => {
        if (!req.token || !req.user) {
            return res.status(401).json({ error: 'token missing or invalid' });
        }

        const p: IProject = req.body;

        const ownerId = req.user.id;
        if (p.owner_id !== ownerId) {
            return res.status(401).json({ error: 'invalid owner id' });
        }

        const q = await db.query(
            'UPDATE project SET name = $1, description = $2, public_view = $3, public_edit = $4 WHERE id = $5 AND owner_id = $6',
            [
                p.name,
                p.description,
                p.public_view,
                p.public_edit,
                p.id,
                p.owner_id,
            ]
        );
        res.status(200).json(q);
        /* const idx = projects.findIndex( pr => pr.id === p.id );
        projects[idx] = p;
        res.status(200).json({ message: 'project updated'}); */
    })
    .delete(async (req: Request, res: Response) => {
        res.status(404).json({ message: 'Not implemented' });
    });

export { router as project };
