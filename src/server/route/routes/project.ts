import { router } from '../router';
import { Request, Response } from 'express';
import { IProject } from '../../../../types';
//import {IError} from '../../domain/IError';
import { db } from '../../dbConfigs';

/* let projects: Array<IProject> = [{id: '1', name: 'test'}]; */

router.route('/project/:id').delete(async (req: Request, res: Response) => {
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
        if (parseInt(project.owner_id) !== ownerId) {
            return res.status(401).json({ error: 'invalid owner id' });
        }

        try {
            const q = await db.query(
                'INSERT INTO project (name, owner_id, description) VALUES ($1, $2, $3) RETURNING id',
                [project.name, project.owner_id, project.description]
            );
            res.status(200).json(q.rows[0]);
            /* console.log('adding project: ', project);
            projects.push(project) */
        } catch (e) {
            console.log('Invalid project', e);
            res.status(403).json();
        }
    })
    .put(async (req: Request, res: Response) => {
        if (!req.token || !req.user) {
            return res.status(401).json({ error: 'token missing or invalid' });
        }

        const p: IProject = req.body;

        const ownerId = req.user.id;
        if (parseInt(p.owner_id) !== ownerId) {
            return res.status(401).json({ error: 'invalid owner id' });
        }

        const q = await db.query(
            'UPDATE project SET name = $1, description = $2 WHERE id = $3 AND owner_id = $4',
            [p.name, p.description, p.id, p.owner_id]
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
