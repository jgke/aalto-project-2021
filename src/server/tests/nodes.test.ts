import {beforeEach, expect, test} from '@jest/globals'
const supertest = require('supertest')
const app = require('../index')

const api = supertest(app)

beforeEach(async () => {
    // ADD DATABASE RESET
})

test('there are two notes', async () => {  
    expect(true)
})