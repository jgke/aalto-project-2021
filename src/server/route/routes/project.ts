import { router } from '../router';
import { Request, Response } from 'express';
import { IProject } from '../../../../types';
//import {IError} from '../../domain/IError';
import { db } from '../../dbConfigs';

/* let projects: Array<IProject> = [{id: '1', name: 'test'}]; */

router.route('/project/:id').delete(async (req: Request, res: Response) => {
    console.log('Deleting project...');
    const id = req.params.id;
    const q = await db.query('DELETE FROM project WHERE id = $1', [id]);
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
        const owner_id = req.params.owner_id;
        const q = await db.query('SELECT * FROM project', []);
        res.json(q.rows);
        /* console.log('projects: ', projects);
        res.json(projects); */
    })
    .post(async (req: Request, res: Response) => {
        console.log('Receiving project...');
        const project: IProject = req.body; //Might have to parse this
        try {
            const q = await db.query(
                'INSERT INTO project (name, owner_id, description) VALUES ($1, $2, $3) RETURNING id',
                [project.name, project.owner_id, project.description]
            );
            res.status(200).json(q);
            /* console.log('adding project: ', project);
            projects.push(project) */
        } catch (e) {
            console.log('Invalid project', e);
            res.status(403).json();
        }
    })
    .put(async (req: Request, res: Response) => {
        const p: IProject = req.body;
        console.log('Updating project...', p);
        const q = await db.query(
            'UPDATE project SET name = $1, description = $2 WHERE id = $3',
            [p.name, p.description, p.id]
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
