import { beforeEach, expect, test, afterAll, describe } from '@jest/globals';
import { db } from '../dbConfigs';
import { INode, IProject } from '../../../types';
import supertest from 'supertest';
import { app } from '../index';

const api = supertest(app);

//Helper functions

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

const addDummyNodes = async () => {
    const n1: INode = {
        label: 'test node',
        priority: 'Urgent',
        status: 'Doing',
        x: 0,
        y: 0,
        project_id: pId,
    };

    const n2: INode = {
        label: 'a second test node',
        priority: 'No rush',
        status: 'Done',
        x: 1,
        y: 2,
        project_id: pId,
    };

    await db.query(
        'INSERT INTO node (label, priority, status, x, y, project_id) VALUES ($1, $2, $3, $4, $5, $6);',
        [n1.label, n1.priority, n1.status, n1.x, n1.y, n1.project_id]
    );

    await db.query(
        'INSERT INTO node (label, priority, status, x, y, project_id) VALUES ($1, $2, $3, $4, $5, $6);',
        [n2.label, n2.priority, n2.status, n2.x, n2.y, n2.project_id]
    );
};

//End of helper functions

beforeEach(async () => {
    // DATABASE RESET
    await db.query('TRUNCATE project, node, edge CASCADE;', []);
    //adding project
    await addDummyProject();
});

describe('Basic GET request', () => {
    test('should work', async () => {
        await api.get(`/api/node/${pId}`).expect(200);
    });
});

describe('POST and GET request', () => {
    test('adding node should be successful', async () => {
        const n: INode = {
            label: 'test node',
            priority: 'Urgent',
            status: 'Doing',
            x: 0,
            y: 0,
            project_id: pId,
        };

        await api.post('/api/node').send(n).expect(200);
    });

    test('GET request should give us a node added to the database', async () => {
        const n: INode = {
            label: 'test node',
            priority: 'Urgent',
            status: 'Doing',
            x: 0,
            y: 0,
            project_id: pId,
        };

        await api.post('/api/node').send(n).expect(200);

        const result = await api.get(`/api/node/${pId}`).expect(200);
        expect(result.body).toHaveLength(1);
        const node = result.body[0];
        expect(node).toHaveProperty('label');
        expect(node).toHaveProperty('priority');
        expect(node).toHaveProperty('status');
        expect(node).toHaveProperty('x');
        expect(node).toHaveProperty('y');
        expect(node).toHaveProperty('project_id');
    });

    test('A node should have the proper values that were sent', async () => {
        const n: INode = {
            label: 'test node',
            priority: 'Urgent',
            status: 'Doing',
            x: 0,
            y: 0,
            project_id: pId,
        };

        await api.post('/api/node').send(n).expect(200);
        const result = await api.get(`/api/node/${pId}`).expect(200);

        const node = result.body[0];
        expect(node.id).toBeDefined;
        expect(node.label).toBe('test node');
        expect(node.priority).toBe('Urgent');
        expect(node.status).toBe('Doing');
        expect(n.x).toBe(0);
        expect(n.y).toBe(0);
        expect(n.project_id).toBe(pId);
    });

    test('an invalid node should not be added to the database', async () => {
        const n = {
            priority: 'Urgent',
            status: 'done',
        };
        await api.post('/api/node').send(n).expect(403);
    });
});

describe('DELETE request', () => {
    test('with an id should delete the node from the DB', async () => {
        await addDummyNodes();

        let result = await api.get(`/api/node/${pId}`).expect(200);
        expect(result.body[0].id).toBeDefined();
        expect(result.body[1].id).toBeDefined();
        const id = result.body[0].id;
        await api.delete(`/api/node/${id}`).expect(200);
        result = await api.get(`/api/node/${pId}`).expect(200);
        console.log('What is the length?', result.body.length);
        expect(result.body).toHaveLength(1);
    });

    test('deletes the right node', async () => {
        await addDummyNodes();

        let res = await api.get(`/api/node/${pId}`).expect(200);

        const id = res.body[0].id;

        await api.delete(`/api/node/${id}`).expect(200);

        res = await api.get(`/api/node/${pId}`).expect(200);
        const found = res.body.find((x: INode) => x.id == id);
        expect(found).toBeUndefined();
    });
});

describe('PUT request', () => {
    test('should update the location of a node', async () => {
        await addDummyNodes();

        const res = await api.get(`/api/node/${pId}`);
        const dummyNode: INode = {
            ...res.body[0],
            x: 50,
            y: 60,
        };

        await api.put('/api/node').send(dummyNode).expect(200);
        const res2 = await api.get(`/api/node/${pId}`);
        const found: INode | undefined = res2.body.find(
            (x: INode) => x.id == res.body[0].id
        );
        if (found) {
            expect(found.x).toBe(50);
            expect(found.y).toBe(60);
        }
    });

    test('should update the label of a node', async () => {
        await addDummyNodes();

        const res = await api.get(`/api/node/${pId}`);
        const dummyNode: INode = {
            ...res.body[0],
            label: 'NEW NAME',
        };

        await api.put('/api/node').send(dummyNode).expect(200);
        const res2 = await api.get(`/api/node/${pId}`);
        const found: INode | undefined = res2.body.find(
            (x: INode) => x.id == res.body[0].id
        );
        if (found) {
            expect(found.label).toBe('NEW NAME');
        }
    });
});

afterAll(async () => {
    // Below are tries to make the weird jest warning go away.
    //MIght become useful
    //(await db.getPool()).end()
    //const client = await db.getClient()
    //client.removeAllListeners()
    //await db.query("SELECT * FROM node", [])
});
