import { beforeEach, beforeAll, expect, test, describe } from '@jest/globals';
import { db } from '../dbConfigs';
import { INode, IProject, Registration, User } from '../../../types';
import supertest from 'supertest';
import { app } from '../index';
import { mockUser } from '../../../testmock';
import { addProject, registerLoginUser } from './testHelper';

const baseUrl = '/api/project';

const api = supertest(app);

//This holds the possible dummy project's ID's
let ids: number[] = [];
const user: User = mockUser;
let token: string;

//Helper functions for the tests
const addDummyProjects = async (): Promise<void> => {
    ids = [];

    const p1: IProject = {
        name: 'Test-1',
        description: 'First-project',
        owner_id: user.id,
        id: 0,
        public_view: true,
        public_edit: true,
    };

    const p2: IProject = {
        name: 'Test-2',
        description: 'Second-project',
        owner_id: user.id,
        id: 0,
        public_view: true,
        public_edit: true,
    };

    ids = [];
    let id = await addProject(db, p1);
    ids.push(id);
    id = await addProject(db, p2);
    ids.push(id);
};

//Helper functions end here
describe('Projects', () => {
    beforeAll(async () => {
        await db.initDatabase();
        const login = await registerLoginUser(api, user);
        user.id = login.id;
        token = login.token;
    });

    beforeEach(async () => {
        await db.query('DELETE FROM project', []);
    });

    describe('GET request', () => {
        test('should give an empty array if there are no projects', async () => {
            const res = await api
                .get(baseUrl)
                .set('Authorization', `bearer ${token}`)
                .expect(200);
            expect(res.body).toHaveLength(0);
        });
    });

    describe('POST request', () => {
        test('should successfully send a project', async () => {
            const p: IProject = {
                name: 'Test-1',
                description: 'First-project',
                owner_id: user.id,
                id: 0,
                public_view: true,
                public_edit: true,
            };

            await api
                .post(baseUrl)
                .set('Authorization', `bearer ${token}`)
                .send(p)
                .expect(200);
        });

        test('should save the project appropriately', async () => {
            const p: IProject = {
                name: 'Test-1',
                description: 'First-project',
                owner_id: user.id,
                id: 0,
                public_view: true,
                public_edit: true,
            };

            await api
                .post(baseUrl)
                .set('Authorization', `bearer ${token}`)
                .send(p)
                .expect(200);

            const res = await api
                .get(baseUrl)
                .set('Authorization', `bearer ${token}`)
                .expect(200);
            expect(res.body).toHaveLength(1);
            const project = res.body[0];
            expect(project.name).toBe('Test-1');
            expect(project.description).toBe('First-project');
            expect(project.owner_id).toBe(user.id);
        });

        test('an invalid project should not be added to the database', async () => {
            const p = {
                name: 'Failing-test',
                description: 'This should fail',
            };
            await api
                .post(baseUrl)
                .set('Authorization', `bearer ${token}`)
                .send(p)
                .expect(401);
        });
    });

    describe('DELETE request', () => {
        test('with an id should delete the project from the DB', async () => {
            await addDummyProjects();

            let result = await api
                .get(baseUrl)
                .set('Authorization', `bearer ${token}`)
                .expect(200);

            expect(result.body[0].id).toBeDefined();
            expect(result.body[1].id).toBeDefined();
            const id = result.body[0].id;
            await api
                .delete(`${baseUrl}/${id}`)
                .set('Authorization', `bearer ${token}`)
                .expect(200);
            result = await api
                .get(baseUrl)
                .set('Authorization', `bearer ${token}`)
                .expect(200);
            expect(result.body).toHaveLength(1);
        });

        test('deletes the right project', async () => {
            await addDummyProjects();

            let res = await api
                .get(baseUrl)
                .set('Authorization', `bearer ${token}`)
                .expect(200);

            const id = res.body[0].id;

            await api
                .delete(`${baseUrl}/${id}`)
                .set('Authorization', `bearer ${token}`)
                .expect(200);

            res = await api
                .get(baseUrl)
                .set('Authorization', `bearer ${token}`)
                .expect(200);
            const found = res.body.find((x: IProject) => x.id == id);
            expect(found).toBeUndefined();
        });

        test('should not crash the app if the project to be deleted does not exist', async () => {
            const p: IProject = {
                name: 'Not-exiting',
                description: 'Not-existing-project',
                owner_id: 0,
                id: 0,
                public_view: true,
                public_edit: true,
            };
            await api
                .delete(`${baseUrl}/${p.id}`)
                .set('Authorization', `bearer ${token}`)
                .expect(200);
        });
    });

    describe('Test project permissions', () => {
        let onlyViewId: number;
        let noViewId: number;

        beforeEach(async () => {
            const p1: IProject = {
                name: 'onlyView',
                description: 'Only viewing no editing',
                owner_id: user.id,
                id: 0,
                public_view: true,
                public_edit: false,
            };

            const p2: IProject = {
                name: 'noView',
                description: 'No viewing no editing',
                owner_id: user.id,
                id: 0,
                public_view: false,
                public_edit: false,
            };

            onlyViewId = await addProject(db, p1);
            noViewId = await addProject(db, p2);
        });

        test('should return 200 on get if public_view is true on an anonymous account', async () => {
            await api.get(`${baseUrl}/${onlyViewId}`).expect(200);
        });

        test('should return 401 on get if public_view is false on an anonymous account', async () => {
            await api.get(`${baseUrl}/${noViewId}`).expect(401);
        });

        test('should return 401 on get if public_edit is false on an anonymous account', async () => {
            const n: INode = {
                label: 'ShouldntBePosted',
                priority: 'Urgent',
                status: 'Doing',
                x: 0,
                y: 0,
                project_id: onlyViewId,
            };

            await api.post('/api/node').send(n).expect(401);
        });
    });
});
