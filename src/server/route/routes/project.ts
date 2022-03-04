import { router } from '../router';
import { Request, Response } from 'express';
import { IProject, ProjectInvite, User } from '../../../../types';
//import {IError} from '../../domain/IError';
import { db } from '../../dbConfigs';

/* let projects: Array<IProject> = [{id: '1', name: 'test'}]; */

const userMemberOfProject = async (userId: number, projectId: number): Promise<boolean> => {
    try {
        const query = await db.query('SELECT * FROM userBelongProject WHERE users_id = $1 AND project_id = $2', [
            userId, projectId,
        ]);

        return query.rowCount > 0;
    } catch (e) {
        return false;
    }
}

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

        const userId = req.user.id;
        const q = await db.query(
            `SELECT * FROM project
            WHERE id IN (
                SELECT project_id FROM userBelongProject
                WHERE users_id = $1
            )`,
            [ userId ]
        );
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

        const client = await db.getClient();
        try {
            await client.query('BEGIN')

            const q = await client.query(
                'INSERT INTO project (name, owner_id, description) VALUES ($1, $2, $3) RETURNING id',
                [project.name, project.owner_id, project.description]
            );

            const projectId = q.rows[0].id;

            client.query(
                'INSERT INTO userBelongProject (users_id, project_id) VALUES ($1, $2)',
                [project.owner_id, projectId]
            );
            client.query('COMMIT');
            res.status(200).json({id: projectId});
            /* console.log('adding project: ', project);
            projects.push(project) */
        } catch (e) {
            console.log('Invalid project', e);
            await client.query('ROLLBACK');
            res.status(403).json();
        } finally {
            client.release();
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

router
    .route('/project/members')
    .post(async (req: Request, res: Response) => {
        if (!req.token || !req.user) {
            return res.status(401).json({ error: 'token missing or invalid' });
        }

        const invite: ProjectInvite = req.body;

        // Test whether inviter belongs in project
        if (!(await userMemberOfProject(req.user.id, invite.projectId))) {
            return res.status(401).json({ error: 'Inviter does not belong in project' });
        }

        // Invite users
        for (const name of invite.invited) {
            try {
                const user: User = (await db.query('SELECT * FROM users WHERE username = $1 OR email = $1', [
                    name,
                ])).rows[0];

                await db.query(
                    'INSERT INTO userBelongProject (users_id, project_id) VALUES ($1, $2)',
                    [user.id, invite.projectId]
                );

                res.status(200);
            } catch (e) {
                console.log('Could not invite ' + name, e);
                res.status(403).json();
            }
        }
    })


export { router as project };
        