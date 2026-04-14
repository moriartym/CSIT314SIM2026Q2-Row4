import request from 'supertest'
import mongoose from 'mongoose'
import app from '../../index.js'

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI)
}, 30000)

afterAll(async () => {
  await mongoose.connection.collection('users').deleteMany({
    email: { $in: ['test00@gmail.com', 'test@gmail.com'] }
  })
  await mongoose.connection.close()
}, 30000)

describe('User API', () => {
  let userId

  // TC-06
  describe('TC-06: Create user account', () => {
    it('TC06-1: should create a user account successfully', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'test',
          email: 'test00@gmail.com',
          password: 'Abc.1234',
          role: 'user_admin'
        })
      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.message).toBe('User Account successfully created')
      userId = res.body.data._id
    })

    it('TC06-2: should not create a user account with duplicate email', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'test',
          email: 'test00@gmail.com',
          password: 'Abc.1234',
          role: 'user_admin'
        })
      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toBe('Email already exists')
    })
  })

  // TC-07
  describe('TC-07: View user account', () => {
    it('TC07-1: should display user details for a valid ID', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}`)
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data._id).toBe(userId)
    })

    it('TC07-2: should return not found for an invalid ID', async () => {
      const res = await request(app)
        .get('/api/users/0000abdef12345')
      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toBe('User ID not found')
    })
  })

  // TC-08
  describe('TC-08: Update user account', () => {
    it('TC08-1: should update a user account successfully', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send({
          name: 'test_456',
          email: 'test00@gmail.com',
          password: 'Abc.1234',
          role: 'user_admin'
        })
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.message).toBe('User Account successfully updated')
    })

    it('TC08-2: should fail to update when user is not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString()
      const res = await request(app)
        .put(`/api/users/${fakeId}`)
        .send({
          name: 'test_456',
          email: 'notfound@gm.com',
          password: 'Abc.1234',
          role: 'user_admin'
        })
      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toBe('User account was not found')
    })
  })
})