import request from 'supertest'
import mongoose from 'mongoose'
import app from '../../index.js'
import UserProfile from '../models/UserProfile.js'
import UserAccount from '../models/UserAccount.js'
import bcrypt from 'bcrypt'

let uaUserId,   uaProfileId,   uaAgent
let frUserId,   frProfileId,   frAgent
let doneeUserId, doneeProfileId, doneeAgent
let pmUserId,   pmProfileId,   pmAgent

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI)

  await mongoose.connection.collection('useraccounts').deleteMany({
    email: { $in: ['auth@test.com', 'frauth@test.com', 'doneeauth@test.com', 'pmauth@test.com'] }
  })
  await mongoose.connection.collection('userprofiles').deleteMany({
    profileName: { $in: ['Auth Test Profile', 'FR Auth Test Profile', 'Donee Auth Test Profile', 'PM Auth Test Profile'] }
  })

  const hash = await bcrypt.hash('Abc.1234', 10)

  uaAgent = request.agent(app)
  const uaProfile = await UserProfile.create({ profileName: 'Auth Test Profile', description: 'For auth testing', permissions: ['user_management'], isActive: true })
  uaProfileId = uaProfile._id.toString()
  const uaUser = await UserAccount.create({ username: 'authuser', email: 'auth@test.com', password: hash, userProfile: uaProfileId, isActive: true })
  uaUserId = uaUser._id.toString()
  await uaAgent.post('/api/auth/login').send({ username: 'authuser', password: 'Abc.1234' })

  frAgent = request.agent(app)
  const frProfile = await UserProfile.create({ profileName: 'FR Auth Test Profile', description: 'For FR auth testing', permissions: ['fundraising'], isActive: true })
  frProfileId = frProfile._id.toString()
  const frUser = await UserAccount.create({ username: 'frauthuser', email: 'frauth@test.com', password: hash, userProfile: frProfileId, isActive: true })
  frUserId = frUser._id.toString()
  await frAgent.post('/api/auth/login').send({ username: 'frauthuser', password: 'Abc.1234' })

  doneeAgent = request.agent(app)
  const doneeProfile = await UserProfile.create({ profileName: 'Donee Auth Test Profile', description: 'For donee auth testing', permissions: ['donating'], isActive: true })
  doneeProfileId = doneeProfile._id.toString()
  const doneeUser = await UserAccount.create({ username: 'doneeauthuser', email: 'doneeauth@test.com', password: hash, userProfile: doneeProfileId, isActive: true })
  doneeUserId = doneeUser._id.toString()
  await doneeAgent.post('/api/auth/login').send({ username: 'doneeauthuser', password: 'Abc.1234' })

  pmAgent = request.agent(app)
  const pmProfile = await UserProfile.create({ profileName: 'PM Auth Test Profile', description: 'For PM auth testing', permissions: ['platform_management'], isActive: true })
  pmProfileId = pmProfile._id.toString()
  const pmUser = await UserAccount.create({ username: 'pmauthuser', email: 'pmauth@test.com', password: hash, userProfile: pmProfileId, isActive: true })
  pmUserId = pmUser._id.toString()
  await pmAgent.post('/api/auth/login').send({ username: 'pmauthuser', password: 'Abc.1234' })
}, 30000)

afterAll(async () => {
  await mongoose.connection.collection('useraccounts').deleteMany({
    email: { $in: ['auth@test.com', 'frauth@test.com', 'doneeauth@test.com', 'pmauth@test.com'] }
  })
  await mongoose.connection.collection('userprofiles').deleteMany({
    profileName: { $in: ['Auth Test Profile', 'FR Auth Test Profile', 'Donee Auth Test Profile', 'PM Auth Test Profile'] }
  })
  await mongoose.connection.close()
}, 30000)

describe('TC-11: UA Login', () => {
  it('TC11-1: should login successfully with valid credentials', async () => {
    const res = await uaAgent.post('/api/auth/login').send({ username: 'authuser', password: 'Abc.1234' })
    expect(res.status).toBe(200)
    expect(res.body._id).toBeDefined()
    expect(res.body.username).toBe('authuser')
  })

  it('TC11-2: should fail login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'authuser', password: 'WrongPass123!' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('TC11-3: should fail login with non-existing user', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'nouser', password: 'Abc.1234' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('TC11-4: should fail login if account is suspended', async () => {
    await uaAgent.patch(`/api/users-account/${uaUserId}/suspend`)
    const res = await request(app).post('/api/auth/login').send({ username: 'authuser', password: 'Abc.1234' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Account is suspended')
  })
})

describe('TC-12: UA Logout', () => {
  beforeAll(async () => {
    await UserAccount.updateOne({ _id: new mongoose.Types.ObjectId(uaUserId) }, { isActive: true })
    await uaAgent.post('/api/auth/login').send({ username: 'authuser', password: 'Abc.1234' })
  })

  it('TC12-1: should logout successfully', async () => {
    const res = await uaAgent.post('/api/auth/logout')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Logged out successfully')
  })

  it('TC12-2: should not access protected route after logout', async () => {
    const res = await uaAgent.get('/api/auth/me')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Not authenticated')
  })
})

describe('TC-18: FR Login', () => {
  it('TC18-1: should login successfully with valid credentials', async () => {
    const res = await frAgent.post('/api/auth/login').send({ username: 'frauthuser', password: 'Abc.1234' })
    expect(res.status).toBe(200)
    expect(res.body._id).toBeDefined()
    expect(res.body.username).toBe('frauthuser')
  })

  it('TC18-2: should fail login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'frauthuser', password: 'WrongPass123!' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('TC18-3: should fail login with non-existing user', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'nofruser', password: 'Abc.1234' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('TC18-4: should fail login if account is suspended', async () => {
    await uaAgent.post('/api/auth/login').send({ username: 'authuser', password: 'Abc.1234' })
    await UserAccount.updateOne({ _id: new mongoose.Types.ObjectId(uaUserId) }, { isActive: true })
    await uaAgent.post('/api/auth/login').send({ username: 'authuser', password: 'Abc.1234' })
    await uaAgent.patch(`/api/users-account/${frUserId}/suspend`)
    const res = await request(app).post('/api/auth/login').send({ username: 'frauthuser', password: 'Abc.1234' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Account is suspended')
  })
})

describe('TC-19: FR Logout', () => {
  beforeAll(async () => {
    await UserAccount.updateOne({ _id: new mongoose.Types.ObjectId(frUserId) }, { isActive: true })
    await frAgent.post('/api/auth/login').send({ username: 'frauthuser', password: 'Abc.1234' })
  })

  it('TC19-1: should logout successfully', async () => {
    const res = await frAgent.post('/api/auth/logout')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Logged out successfully')
  })

  it('TC19-2: should not access protected route after logout', async () => {
    const res = await frAgent.get('/api/auth/me')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Not authenticated')
  })
})

describe('TC-25: Donee Login', () => {
  it('TC25-1: should login successfully with valid credentials', async () => {
    const res = await doneeAgent.post('/api/auth/login').send({ username: 'doneeauthuser', password: 'Abc.1234' })
    expect(res.status).toBe(200)
    expect(res.body._id).toBeDefined()
    expect(res.body.username).toBe('doneeauthuser')
  })

  it('TC25-2: should fail login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'doneeauthuser', password: 'WrongPass123!' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('TC25-3: should fail login with non-existing user', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'nodoneeuser', password: 'Abc.1234' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('TC25-4: should fail login if account is suspended', async () => {
    await UserAccount.updateOne({ _id: new mongoose.Types.ObjectId(uaUserId) }, { isActive: true })
    await uaAgent.post('/api/auth/login').send({ username: 'authuser', password: 'Abc.1234' })
    await uaAgent.patch(`/api/users-account/${doneeUserId}/suspend`)
    const res = await request(app).post('/api/auth/login').send({ username: 'doneeauthuser', password: 'Abc.1234' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Account is suspended')
  })
})

describe('TC-26: Donee Logout', () => {
  beforeAll(async () => {
    await UserAccount.updateOne({ _id: new mongoose.Types.ObjectId(doneeUserId) }, { isActive: true })
    await doneeAgent.post('/api/auth/login').send({ username: 'doneeauthuser', password: 'Abc.1234' })
  })

  it('TC26-1: should logout successfully', async () => {
    const res = await doneeAgent.post('/api/auth/logout')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Logged out successfully')
  })

  it('TC26-2: should not access protected route after logout', async () => {
    const res = await doneeAgent.get('/api/auth/me')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Not authenticated')
  })
})

describe('TC-41: Platform Management Login', () => {
  it('TC41-1: should login successfully with valid credentials', async () => {
    const res = await pmAgent.post('/api/auth/login').send({ username: 'pmauthuser', password: 'Abc.1234' })
    expect(res.status).toBe(200)
    expect(res.body._id).toBeDefined()
    expect(res.body.username).toBe('pmauthuser')
  })

  it('TC41-2: should fail login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'pmauthuser', password: 'WrongPass123!' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('TC41-3: should fail login with non-existing user', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'nopmuser', password: 'Abc.1234' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('TC41-4: should fail login if account is suspended', async () => {
    await UserAccount.updateOne({ _id: new mongoose.Types.ObjectId(uaUserId) }, { isActive: true })
    await uaAgent.post('/api/auth/login').send({ username: 'authuser', password: 'Abc.1234' })
    await uaAgent.patch(`/api/users-account/${pmUserId}/suspend`)
    const res = await request(app).post('/api/auth/login').send({ username: 'pmauthuser', password: 'Abc.1234' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Account is suspended')
  })
})

describe('TC-42: Platform Management Logout', () => {
  beforeAll(async () => {
    await UserAccount.updateOne({ _id: new mongoose.Types.ObjectId(pmUserId) }, { isActive: true })
    await pmAgent.post('/api/auth/login').send({ username: 'pmauthuser', password: 'Abc.1234' })
  })

  it('TC42-1: should logout successfully', async () => {
    const res = await pmAgent.post('/api/auth/logout')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Logged out successfully')
  })

  it('TC42-2: should not access protected route after logout', async () => {
    const res = await pmAgent.get('/api/auth/me')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Not authenticated')
  })
})