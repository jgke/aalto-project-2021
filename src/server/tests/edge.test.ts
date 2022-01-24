import { beforeEach, expect, test, afterAll, describe } from '@jest/globals';
import { db } from '../dbConfigs';
import { IEdge, INode, IProject } from '../../../types';
import supertest from 'supertest';
import { app } from '../index';

const baseUrl = '/api/edge';

const api = supertest(app);

//This holds the possible dummy node's ID's
let ids: string[] = [];

//Helper functions for the tests
let pId = 0;

const addDummyProject = async () => {
    const p: IProject = {
        name: 'Test-1',
        description: 'First-project',
        owner_id: 'temp',
        id: 0,
    };

    pId = (
        await db.query(
            'INSERT INTO project (name, owner_id, description) VALUES ($1, $2, $3) RETURNING id',
            [p.name, p.owner_id, p.description]
        )
    ).rows[0].id;
};

const addDummyNodes = async (): Promise<void> => {
    ids = [];

    const n1: INode = {
        label: 'First-node',
        priority: 'Very Urgent',
        status: 'Doing',
        x: 0,
        y: 0,
        project_id: pId,
    };

    const n2: INode = {
        label: 'Second-node',
        priority: 'Urgent',
        status: 'ToDo',
        x: 1,
        y: 1,
        project_id: pId,
    };

    ids = [];
    let r = await db.query(
        'INSERT INTO node (label, priority, status, x, y, project_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;',
        [n1.label, n1.priority, n1.status, n1.x, n1.y, n1.project_id]
    );
    ids.push(r.rows[0].id);
    r = await db.query(
        'INSERT INTO node (label, priority, status, x, y, project_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;',
        [n2.label, n2.priority, n2.status, n2.x, n2.y, n2.project_id]
    );
    ids.push(r.rows[0].id);
};

//Helper functions end here

beforeEach(async () => {
    await db.query('TRUNCATE project, node, edge CASCADE;', []);
    await addDummyProject();
});

describe('GET request', () => {
    test('should give an empty array if there are no edges', async () => {
        const res = await api.get(`${baseUrl}/${pId}`).expect(200);
        expect(res.body).toHaveLength(0);
    });

    test('should give an edge if there is one', async () => {
        await addDummyNodes();

        await db.query(
            'INSERT INTO edge (source_id, target_id, project_id) VALUES ($1, $2, $3)',
            [ids[0], ids[1], pId]
        );
        const res = await api.get(`${baseUrl}/${pId}`).expect(200);
        expect(res.body).toHaveLength(1);
        const e: IEdge = res.body[0];
        expect(e.source_id).toBe(ids[0]);
        expect(e.target_id).toBe(ids[1]);
        expect(e.project_id).toBe(pId);
    });
});

describe('POST request', () => {
    test('should successfully send an edge', async () => {
        await addDummyNodes();
        const e: IEdge = {
            source_id: ids[0],
            target_id: ids[1],
            project_id: pId,
        };

        await api.post(baseUrl).send(e).expect(200);
    });

    test('should save the edge appropriately', async () => {
        await addDummyNodes();

        const e: IEdge = {
            source_id: ids[0],
            target_id: ids[1],
            project_id: pId,
        };

        await api.post(baseUrl).send(e).expect(200);

        const res = await api.get(`${baseUrl}/${pId}`).expect(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].source_id).toBe(ids[0]);
        expect(res.body[0].target_id).toBe(ids[1]);
        expect(res.body[0].project_id).toBe(pId);
    });

    test('should not allow duplicate edges', async () => {
        await addDummyNodes();

        const e: IEdge = {
            source_id: ids[0],
            target_id: ids[1],
            project_id: pId,
        };

        await api.post(baseUrl).send(e).expect(200);

        await api.post(baseUrl).send(e).expect(403);
        //Edges with switched source and target are still allowed, altough they shouldn't!
    });
});

describe('DELETE request', () => {
    test('should delete a single edge', async () => {
        await addDummyNodes();

        const e: IEdge = {
            source_id: ids[0],
            target_id: ids[1],
            project_id: pId,
        };

        await api.post(baseUrl).send(e).expect(200);

        let res = await api.get(`${baseUrl}/${pId}`).expect(200);
        expect(res.body).toHaveLength(1);

        await api
            .delete(
                `${baseUrl}/${res.body[0].source_id}/${res.body[0].target_id}`
            )
            .expect(200);

        res = await api.get(`${baseUrl}/${pId}`).expect(200);

        expect(res.body).toHaveLength(0);
    });

    test('should not crash the app if the edge to be deleted does not exist', async () => {
        const e: IEdge = {
            source_id: '-1',
            target_id: '-1',
            project_id: pId,
        };
        await api
            .delete(`${baseUrl}/${e.source_id}/${e.target_id}`)
            .expect(200);
    });
});

afterAll(() => {
    console.log('Tests are done!');
});
