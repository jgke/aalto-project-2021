import {beforeEach, expect, test, afterAll} from '@jest/globals'
import { db } from '../dbConfigs'
import { INode } from '../domain/INode'
//import pgSetup from '@databases/pg-test/jest/globalSetup';
//import pgTeardown from '@databases/pg-test/jest/globalTeardown';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const supertest = require('supertest')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require('../index')

const api = supertest(app)

beforeEach(async() => {
    // ADD DATABASE RESET
    //Doing something with the database allows the console.log to happen in the migration
    await db.query("TRUNCATE node, edge CASCADE;", [])
    
})

test('there are two notes', async () => {
    await api
        .get('/api/node')
        .expect(200)
})

test('adding node to database should be succesful', async () => {
    const n:INode = {
        description: "test node",
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
        description: "test node",
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


afterAll(async() => {
    //console.log("We ended")
    //(await db.getPool()).end()
    const client = await db.getClient()
    client.removeAllListeners()
    //await db.query("SELECT * FROM node", [])
})