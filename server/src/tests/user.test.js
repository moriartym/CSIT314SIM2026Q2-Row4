import request from 'supertest'
import mongoose from 'mongoose'
import app from '../../index.js'


beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI)
}, 30000)

afterAll(async () => {
  await mongoose.connection.collection('users').deleteMany({ email: 'test@gmail.com' })
  await mongoose.connection.close()
}, 30000)

describe('User API', () => {
  let userId

  it('should create a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'test@gmail.com',
        password: '123456',
        role: 'user_admin'
      })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.name).toBe('Test User')
    userId = res.body.data._id
  })

  it('should get a user by id', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data._id).toBe(userId)
  })

  it('should update a user', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: 'Updated User' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.name).toBe('Updated User')
  })
})