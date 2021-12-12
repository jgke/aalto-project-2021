import { beforeEach, expect, test, afterAll, describe } from '@jest/globals';
import { db } from '../dbConfigs';
import { IEdge } from '../domain/IEdge';
import { INode } from '../domain/INode';
const baseUrl = '/api/edge';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const supertest = require('supertest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require('../index');

const api = supertest(app);

let ids: number[] = [];

beforeEach(async () => {
    await db.query('TRUNCATE node, edge CASCADE;', []);

    const n1: INode = {
        description: 'First-node',
        priority: 'Very Urgent',
        status: 'Doing',
        x: 0,
        y: 0,
    };

    const n2: INode = {
        description: 'Second-node',
        priority: 'Urgent',
        status: 'ToDo',
        x: 1,
        y: 1,
    };

    ids = [];
    let r = await db.query(
        'INSERT INTO node (description, status, priority, x, y) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [n1.description, n1.priority, n1.status, n1.x, n1.y]
    );
    ids.push(r.rows[0].id);
    r = await db.query(
        'INSERT INTO node (description, status, priority, x, y) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [n2.description, n2.priority, n2.status, n2.x, n2.y]
    );
    ids.push(r.rows[0].id);
});

describe('GET request', () => {
    test('should give an empty array if there are no edges', async () => {
        const res = await api.get(baseUrl).expect(200);
        expect(res.body).toHaveLength(0);
    });

    test('should give an edge if there is one', async () => {
        await db.query(
            'INSERT INTO edge (source_id, target_id) VALUES ($1, $2)',
            ids
        );
        const res = await api.get(baseUrl).expect(200);
        expect(res.body).toHaveLength(1);
        const e: IEdge = res.body[0];
        expect(e.source_id).toBe(ids[0]);
        expect(e.target_id).toBe(ids[1]);
    });
});

describe('POST request', () => {
    test('should successfully send an edge', async () => {
        const e: IEdge = {
            source_id: ids[0],
            target_id: ids[1],
        };

        await api.post(baseUrl).send(e).expect(200);
    });

    test('should save the edge appropriately', async () => {
        const e: IEdge = {
            source_id: ids[0],
            target_id: ids[1],
        };

        await api.post(baseUrl).send(e).expect(200);

        const res = await api.get(baseUrl).expect(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].source_id).toBe(ids[0]);
        expect(res.body[0].target_id).toBe(ids[1]);
    });

    test('should not allow duplicate edges', async () => {
        const e: IEdge = {
            source_id: ids[0],
            target_id: ids[1],
        };

        await api.post(baseUrl).send(e).expect(200);

        await api.post(baseUrl).send(e).expect(403);
        //Edges with switched source and target are still allowed, altough they shouldn't!
    });
});

describe('DELETE request', () => {
    test('should delete a single edge', async () => {
        const e: IEdge = {
            source_id: ids[0],
            target_id: ids[1],
        };

        await api.post(baseUrl).send(e).expect(200);

        let res = await api.get(baseUrl).expect(200);
        expect(res.body).toHaveLength(1);

        await api
            .delete(
                `${baseUrl}/${res.body[0].source_id}/${res.body[0].target_id}`
            )
            .expect(200);

        res = await api.get(baseUrl).expect(200);

        expect(res.body).toHaveLength(0);
    });

    test('should not crash the app if the edge to be deleted does not exist', async () => {
        const e: IEdge = {
            source_id: -1,
            target_id: -1,
        };
        await api
            .delete(`${baseUrl}/${e.source_id}/${e.target_id}`)
            .expect(200);
    });
});
