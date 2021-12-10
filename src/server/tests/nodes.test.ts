import {beforeEach, expect, test, afterAll, describe} from '@jest/globals'
import { db } from '../dbConfigs'
import { INode } from '../../../types'
import supertest from 'supertest'
import { app } from '../index'

const api = supertest(app)

//Helper functions

const addDummyNodes = async () => {

    const n1: INode = {
        label: "test node",
        priority: "Urgent",
        status: 'Doing',
        x: 0,
        y: 0
    }

    const n2: INode = {
        label: "a second test node",
        priority: "No rush",
        status: 'Done',
        x: 1,
        y: 2
    }

    await db
    .query('INSERT INTO node (label, priority, status, x, y) VALUES ($1, $2, $3, $4, $5);', [n1.label, n1.priority, n1.status, n1.x, n1.y])
    
    await db
    .query('INSERT INTO node (label, priority, status, x, y) VALUES ($1, $2, $3, $4, $5);', [n2.label, n2.priority, n2.status, n2.x, n2.y])

}

//End of helper functions


beforeEach(async() => {
    // DATABASE RESET
    await db.query("TRUNCATE node, edge CASCADE;", [])
    
})

describe("Besic GET request", () => {
    test("should workd", async() => {
        await api
                .get('/api/node')
                .expect(200)
    })
})

describe("POST and GET request", () => {

    test('adding node should be succesful', async () => {
        const n:INode = {
            label: "test node",
            priority: "Urgent",
            status: 'Doing',
            x: 0,
            y: 0
        }

        await api
            .post('/api/node')
            .send(n)
            .expect(200)
    })

    test("GET request should give us a node added to the database", async() => {
        const n:INode = {
            label: "test node",
            priority: "Urgent",
            status: 'Doing',
            x: 0,
            y: 0
        }

        await api
            .post('/api/node')
            .send(n)
            .expect(200)

        const result = await api
                            .get('/api/node')
                            .expect(200)
        expect(result.body).toHaveLength(1)
        const node = result.body[0]
        expect(node).toHaveProperty('label')
        expect(node).toHaveProperty('priority')
        expect(node).toHaveProperty('status')
        expect(node).toHaveProperty('x')
        expect(node).toHaveProperty('y')
    })

    test("A node should have the proper values that were sent", async() => {
        const n:INode = {
            label: "test node",
            priority: "Urgent",
            status: 'Doing',
            x: 0,
            y: 0
        }

        await api
            .post('/api/node')
            .send(n)
            .expect(200)
        const result = await api
                        .get('/api/node')
                        .expect(200)

        const node = result.body[0]
        expect(node.id).toBeDefined
        expect(node.label).toBe('test node')
        expect(node.priority).toBe('Urgent')
        expect(node.status).toBe('Doing')
        expect(n.x).toBe(0)
        expect(n.y).toBe(0)
    })

    test("an invalid node should not be added to the database", async () => {
        const n = {
            priority: "Urgent",
            status: "done"
        }
        await api
            .post('/api/node')
            .send(n)
            .expect(403)
    })
})

describe("DELETE request", () => {
    test("with an id should delete the node from the DB", async() => {
        await addDummyNodes()

        let result = await api
                        .get('/api/node')
                        .expect(200)
        expect(result.body[0].id).toBeDefined()
        expect(result.body[1].id).toBeDefined()
        const id = result.body[0].id
        await api
                .delete(`/api/node/${id}`)
                .expect(200)
        result = await api
                        .get('/api/node')
                        .expect(200)
        console.log("What is the length?", result.body.length)
        expect(result.body).toHaveLength(1)
        
    })

    test("deletes the right node", async() => {
        await addDummyNodes()

        let res = await api
                .get('/api/node')
                .expect(200)

        const id = res.body[0].id

        await api
            .delete(`/api/node/${id}`)
            .expect(200)
        
        res = await api
                    .get('/api/node')
                    .expect(200)
        const found = res.body.find((x: INode) => x.id == id)
        expect(found).toBeUndefined()

    })
})

afterAll(async() => {
    // Below are tries to make the weird jest warning go away. 
    //MIght become useful
    //(await db.getPool()).end()
    //const client = await db.getClient()
    //client.removeAllListeners()
    //await db.query("SELECT * FROM node", [])
})