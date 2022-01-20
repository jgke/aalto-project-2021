import { beforeEach, expect, test, afterAll, describe } from '@jest/globals';
import { db } from '../dbConfigs';
import { IProject } from '../../../types';
import supertest from 'supertest';
import { app } from '../index';

const baseUrl = '/api/project';

const api = supertest(app);

//This holds the possible dummy project's ID's
let ids: string[] = [];

//Helper functions for the tests
const addDummyProjects = async (): Promise<void> => {
    ids = [];

    const p1: IProject = {
        name: 'Test-1',
        description: 'First-project',
        owner_id: 'temp',
        id: 0
    };

    const p2: IProject = {
        name: 'Test-2',
        description: 'Second-project',
        owner_id: 'temp',
        id: 0
    };

    ids = [];
    let r = await db.query(
        'INSERT INTO project (name, owner_id, description) VALUES ($1, $2, $3) RETURNING id',
        [p1.name, p1.owner_id, p1.description]
    );
    ids.push(r.rows[0].id);
    r = await db.query(
        'INSERT INTO project (name, owner_id, description) VALUES ($1, $2, $3) RETURNING id',
        [p2.name, p2.owner_id, p2.description]
    );
    ids.push(r.rows[0].id);
};

//Helper functions end here

beforeEach(async () => {
    await db.query('TRUNCATE project, node, edge CASCADE;', []);
});

describe('GET request', () => {
    test('should give an empty array if there are no projects', async () => {
        const res = await api.get(baseUrl).expect(200);
        expect(res.body).toHaveLength(0);
    });
});

describe('POST request', () => {
    test('should successfully send a project', async () => {
        const p: IProject = {
            name: 'Test-1',
            description: 'First-project',
            owner_id: 'temp',
            id: 0
        };

        await api.post(baseUrl).send(p).expect(200);
    });

    test('should save the project appropriately', async () => {
        const p: IProject = {
            name: 'Test-1',
            description: 'First-project',
            owner_id: 'temp',
            id: 0
        };

        await api.post(baseUrl).send(p).expect(200);

        const res = await api.get(baseUrl).expect(200);
        expect(res.body).toHaveLength(1);
        const project = res.body[0];
        expect(project.name).toBe('Test-1');
        expect(project.description).toBe('First-project');
        expect(project.owner_id).toBe('temp');
    });

    test('an invalid project should not be added to the database', async () => {
        const p = {
            name: 'Failing-test',
            description: 'This should fail',
        };
        await api.post(baseUrl).send(p).expect(403);
    });
});

describe('DELETE request', () => {
    test('with an id should delete the project from the DB', async () => {
        await addDummyProjects();

        let result = await api.get(baseUrl).expect(200);
        expect(result.body[0].id).toBeDefined();
        expect(result.body[1].id).toBeDefined();
        const id = result.body[0].id;
        await api.delete(`${baseUrl}/${id}`).expect(200);
        result = await api.get(baseUrl).expect(200);
        expect(result.body).toHaveLength(1);
    });


    test('deletes the right project', async () => {
        await addDummyProjects();

        let res = await api.get(baseUrl).expect(200);

        const id = res.body[0].id;

        await api.delete(`${baseUrl}/${id}`).expect(200);

        res = await api.get(baseUrl).expect(200);
        const found = res.body.find((x: IProject) => x.id == id);
        expect(found).toBeUndefined();
    });

    test('should not crash the app if the project to be deleted does not exist', async () => {
        const p: IProject = {
            name: 'Not-exiting',
            description: 'Not-existing-project',
            owner_id: 'ghost',
            id: -1
        };
        await api
            .delete(`${baseUrl}/${p.id}`)
            .expect(200);
    });
});

afterAll(() => {
    console.log('Tests are done!');
});
