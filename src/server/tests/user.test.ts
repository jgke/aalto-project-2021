import { beforeEach, expect, test, afterAll, describe } from '@jest/globals';
import { db } from '../dbConfigs';
import { INode } from '../../../types';
import supertest from 'supertest';
import { app } from '../index';
import bcrypt from 'bcrypt'

const api = supertest(app);
const baseUrl = '/api/user'

const dummyUsers = [
    {
        username: 'Mr_Test1',
        password: 'My_Secret_password'
    },
    {
        username: 'Jane_Doe',
        password: 'SweetKitties65#'
    }
]

const addDummyUsers = async () => {

    dummyUsers.forEach(async user => {

        const hash = await bcrypt.hash(user.password, 10)
        await db.query('INSERT INTO users (username, password) VALUES ($1, $2);', [user.username, hash])
    })

}

beforeEach(async () => {
    await db.query('TRUNCATE users', [])
})

describe('User registration', () => {
    test('sending a POST request with appropriate information should add a user', async () => {

        const person = {
            username: 'Tommy',
            password: 'FlyingCows123'
        }

        await api.post(`${baseUrl}/register`).send(person).expect(200)
    })

    test('POST requests with missing values should not add users', async () => {

        //Missing password
        const person1 = {
            username: 'Tommy',
        }

        let res = await api.post(`${baseUrl}/register`).send(person1).expect(403)
        expect(res.body.message).toBe('Missing parameters')

        //Missing username
        const person2 = {
            password: 'FlyingCows555'
        }

        res = await api.post(`${baseUrl}/register`).send(person2).expect(403)
        expect(res.body.message).toBe('Missing parameters')

        //Send an empty object

        res = await api.post(`${baseUrl}/register`).send({}).expect(403)
        expect(res.body.message).toBe('Missing parameters')

    })

    test('password should be saved in hashes not in plain text', async () => {

        await api.post(`${baseUrl}/register`).send(dummyUsers[0]).expect(200)
        await api.post(`${baseUrl}/register`).send(dummyUsers[1]).expect(200)


        const q = await db.query('SELECT * FROM users;', [])
        const rows = q.rows.map(x => x.password)
        dummyUsers.map(x => x.password).forEach(password => {
            expect(rows.includes(password)).toBeFalsy()
        })

        rows.forEach(x => expect(x).toHaveLength(60))
    })

    test('saved password hashes should be correct', async () => {

        await api.post(`${baseUrl}/register`).send(dummyUsers[0]).expect(200)
        await api.post(`${baseUrl}/register`).send(dummyUsers[1]).expect(200)
        
        const { rows } = await db.query('SELECT * FROM users;', [])
        for(let i = 0; i < dummyUsers.length; i++){
            const comparison = await bcrypt.compare(dummyUsers[i].password, rows[i].password)
            expect(comparison).toBeTruthy()
        }
    })
})