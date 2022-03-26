import { router } from '../router';
import { Request, Response } from 'express';
import { INode } from '../../../../types';
import { db } from '../../dbConfigs';
import { checkProjectPermission } from '../../helper/permissionHelper';
import { projectIo } from '../../helper/socket';

// Checks need to make sure the node is valid
const nodeCheck = (node: INode): boolean => {
    //Check that the node has all properties
    return Boolean(
        node.label &&
        node.status &&
        node.priority &&
        // eslint-disable-next-line no-prototype-builtins
        node.hasOwnProperty('x') &&
        // eslint-disable-next-line no-prototype-builtins
        node.hasOwnProperty('y') &&
        node.project_id
    );
};

/**
 * GET /api/node/:id
 * @summary Fetch nodes
 * @description Fetch all nodes belonging to the project
 * @pathParam {string} id - Id of the project of which to fetch nodes
 * @response 200 - OK
 * @response 401 - Unauthorized
 * @response 403 - Forbidden
 */
router
    .route('/node/:id')
    .get(async (req: Request, res: Response) => {
        const project_id = parseInt(req.params.id);

        const permissions = await checkProjectPermission(req, project_id);

        if (!permissions.view) {
            return res.status(401).json({ message: 'No permission' });
        }
        const q = await db.query('SELECT * FROM node WHERE project_id = $1', [
            project_id,
        ]);
        res.json(q.rows);
    })
    /**
     * DELETE /api/node/:id
     * @summary Delete a node
     * @description Deletes the specific node with id ':id' and all edges connected to that node
     * @pathParam {string} id - Node id
     * @response 200 - OK
     * @response 401 - Unauthorized
     * @response 403 - Forbidden
     */
    .delete(async (req: Request, res: Response) => {
        const id = req.params.id;

        const nodeQuery = await db.query(
            'SELECT project_id FROM node WHERE id = $1',
            [id]
        );

        if (nodeQuery.rowCount === 0) {
            return res.status(403).json({ message: 'Node does not exist' });
        }

        const permissions = await checkProjectPermission(
            req,
            nodeQuery.rows[0].project_id
        );
        if (!permissions.edit) {
            return res.status(401).json({ message: 'No permission' });
        }

        await db.query('DELETE FROM node WHERE id = $1', [id]);
        res.status(200).json();
    });

/**
 * POST /api/node
 * @summary Create a node
 * @description Create a new **node** for a **project**. You may need certain privilages to be able to add a node
 * @bodyContent {Node} - application/json
 * @bodyRequired
 * @response 200 - OK
 * @response 401 - Unauthorized
 * @response 403 - Forbidden
 */
router
    .route('/node')
    .post(async (req: Request, res: Response) => {
        const text: INode = req.body; //Might have to parse this

        if (nodeCheck(text)) {
            const permissions = await checkProjectPermission(
                req,
                text.project_id
            );
            if (!permissions.edit) {
                return res.status(401).json({ message: 'No permission' });
            }

            const q = await db.query(
                'INSERT INTO node (label, status, priority, project_id, x, y) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                [
                    text.label,
                    text.status,
                    text.priority,
                    text.project_id,
                    Math.round(text.x),
                    Math.round(text.y),
                ]
            );
            if (projectIo) {
                projectIo
                    .except(req.get('socketId')!)
                    .to(text.project_id.toString())
                    .emit('add-node', { ...text, id: q.rows[0].id });
            }
            res.status(200).json({ id: q.rows[0].id });
        } else {
            res.status(403).json({ message: 'Invalid node' });
        }
    })
    /**
     * PUT /api/node
     * @bodyRequired
     * @summary Update node
     * @description Updates the value of a node.
     * @bodyRequired
     * @bodyContent {FullNode} - application/json
     * @response 200 - OK
     * @response 403 - Forbidden
     */
    .put(async (req: Request, res: Response) => {
        const n: INode = req.body;

        if (nodeCheck(n) && n.id) {
            const permissions = await checkProjectPermission(req, n.project_id);

            if (!permissions.edit) {
                return res.status(401).json({ message: 'No permission' });
            }

            await db.query(
                'UPDATE node SET label = $1, status = $2, priority = $3, x = $4, y = $5 WHERE id = $6',
                [
                    n.label,
                    n.status,
                    n.priority,
                    Math.round(n.x),
                    Math.round(n.y),
                    n.id,
                ]
            );
            res.status(200).json();
        } else {
            // eslint-disable-next-line no-console
            console.error('Invalid data', n);
            res.status(403).json({ message: 'Invalid data' });
        }
    });

export { router as node };
