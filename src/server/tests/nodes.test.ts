import { beforeEach, expect, test, describe, beforeAll, afterAll, afterEach } from '@jest/globals';
import { db } from '../dbConfigs';
import { INode, User } from '../../../types';
import supertest from 'supertest';
import { app } from '../index';
import {
    addDummyNodes,
    addDummyProject,
    registerRandomUser,
} from './testHelper';
import { io as ServerIo, projectIo } from '../helper/socket';
import io, { Socket } from 'socket.io-client';

const api = supertest(app);

let pId: number;
let user: User;

let clientSocket: Socket;

describe('Node', () => {
    beforeAll(async () => {
        await db.initDatabase();
        const login = await registerRandomUser(api);
        user = login.user;

        clientSocket = io('http://localhost:8051/project')
    });

    afterAll(() => {
        projectIo.disconnectSockets()
        ServerIo.disconnectSockets();
        ServerIo.close();
        clientSocket.close();
        clientSocket.disconnect();
    })

    beforeEach(async () => {
        //adding project
        pId = await addDummyProject(db, user.id);
        clientSocket.emit('join-project', pId.toString());

    });

    afterEach(() => {
        clientSocket.off('add-node')
        clientSocket.off('update-node')
        clientSocket.emit('leave-project', pId)
    })

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
                x: 1,
                y: 2,
                project_id: pId,
            };

            await api.post('/api/node').send(n).expect(200);
            const result = await api.get(`/api/node/${pId}`).expect(200);

            const node = result.body[0];
            expect(node.id).toBeDefined;
            expect(node.label).toBe('test node');
            expect(node.priority).toBe('Urgent');
            expect(node.status).toBe('Doing');
            expect(n.x).toBe(1);
            expect(n.y).toBe(2);
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
            await addDummyNodes(db, pId);

            let result = await api.get(`/api/node/${pId}`).expect(200);
            expect(result.body[0].id).toBeDefined();
            expect(result.body[1].id).toBeDefined();
            const id = result.body[0].id;
            await api.delete(`/api/node/${id}`).expect(200);
            result = await api.get(`/api/node/${pId}`).expect(200);

            expect(result.body).toHaveLength(1);
        });

        test('deletes the right node', async () => {
            await addDummyNodes(db, pId);

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
            await addDummyNodes(db, pId);

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
            await addDummyNodes(db, pId);

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

    describe('Database', () => {
        test('should be safe from SQL injections', async () => {
            let node: INode = {
                label: 'Let us hack!',
                // eslint-disable-next-line quotes
                priority: "'Urgent); DROP TABLE nodes; --'",
                status: 'Doing',
                x: 0,
                y: 0,
                project_id: pId,
            };

            await api.post('/api/node').send(node).expect(200);
            let q = await db.query('SELECT * FROM node WHERE priority=$1', [
                node.priority,
            ]);
            expect(q.rowCount).toBeGreaterThan(0);

            node = {
                ...node,
                // eslint-disable-next-line quotes
                label: "'Try hacking); DROP TABLE nodes; --'",
                priority: 'Urgent',
            };

            await api.post('/api/node').send(node).expect(200);
            q = await db.query('SELECT * FROM node WHERE  label=$1', [
                node.label,
            ]);
            expect(q.rowCount).toBeGreaterThan(0);
        });
    });

    describe('sockets', () => {
        test('should notice when a node is added', async () => {
            const node1: INode = {
                label: 'socket-tester',
                priority: 'Urgent',
                project_id: pId,
                status: 'Doing',
                x: 10,
                y: 10,
            }

            clientSocket.on('add-node', (n) => {
                delete n.id
                expect(n).toEqual(node1)
            })

            await api.post('/api/node').send(node1).expect(200)
        })


        test('should not see a node if a faulty node was added', async () => {
            const node1 = {
                label: 'socket-tester',
                priority: 'Urgent'
            }


            clientSocket.on('add-node', (n) => {
                //Fails the test if if adding a node is noticed!
                expect(0).toBe(1)
            })

            await api.post('/api/node').send(node1).expect(403)

        });

        test('should see if a node was updated', async () => {
            const node1: INode = {
                label: 'socket-tester2',
                priority: 'Urgent',
                project_id: pId,
                status: 'Doing',
                x: 10,
                y: 10,
            }

            const q = await api.post('/api/node').send(node1).expect(200)

            node1.id = q.body.id
            node1.y = 99
            node1.x = 99


            clientSocket.on('update-node', (n) => {
                expect(n).toEqual(node1)
            })

            await api.put('/api/node').send(node1).expect(200)
        })

        test('should notice when a node was deleted', async () => {
            const node1: INode = {
                label: 'socket-tester3',
                priority: 'Urgent',
                project_id: pId,
                status: 'Doing',
                x: 10,
                y: 10,
            }

            const q = await api.post('/api/node').send(node1).expect(200)

            clientSocket.on('delete-node', (id) => {
                expect(id.id).toBe(q.body.id.toString())
            })

            await api.del(`/api/node/${q.body.id}`).expect(200)

        })
    })
});
