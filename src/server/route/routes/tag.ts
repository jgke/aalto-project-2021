import { router } from '../router';
import { Request, Response } from 'express';
import { ITag, ITaggedNode } from '../../../../types';
//import {IError} from '../../domain/IError';
import { db } from '../../dbConfigs';

/* let tags: Array<ITag> = [{id: 1, label: 'test', color: 'red'}]; */

router.route('/tag/:id').delete(async (req: Request, res: Response) => {
    const id = req.params.id;
    const q = await db.query('DELETE FROM tag WHERE id = $1', [id]);
    res.status(200).json(q);
    //the latter part is only for testing with array
    /* const idx = tags.findIndex( t => t.id === id );
    if(idx >= 0){
        console.log('deleting tag: ', tags[idx]);
        tags.splice(idx, 1);
        res.status(200).json({ message: 'deleted tag'})
    } else {
        console.log('could not find tag with id: ', id);
    } */
});

router
    .route('/tag')
    .get(async (req: Request, res: Response) => {
        const q = await db.query('SELECT * FROM tag', []);
        res.json(q.rows);
        /* console.log('tags: ', tags);
        res.json(tags); */
    })
    .post(async (req: Request, res: Response) => {
        const tag: ITag = req.body;

        try {
            const q = await db.query(
                'INSERT INTO tag (id, label, color) VALUES ($1, $2, $3) RETURNING id',
                [tag.id, tag.label, tag.color]
            );
            res.status(200).json(q);
            /* console.log('adding tag: ', tag);
            tags.push(tag) */
        } catch (e) {
            console.log('Invalid tag', e);
            res.status(403).json();
        }
    })
    .put(async (req: Request, res: Response) => {
        const t: ITag = req.body;
        const q = await db.query(
            'UPDATE tag SET label = $1, color = $2 WHERE id = $3',
            [t.label, t.color, t.id]
        );
        res.status(200).json(q);
        /* const idx = tags.findIndex( tg => tg.id === t.id );
        tags[idx] = t;
        res.status(200).json({ message: 'tag updated'}); */
    })
    .delete(async (req: Request, res: Response) => {
        res.status(404).json({ message: 'Not implemented' });
    });

export { router as tag };