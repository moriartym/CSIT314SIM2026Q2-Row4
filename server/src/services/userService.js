import UserRepository from '../repositories/UserRepository.js'
import bcrypt from 'bcrypt'

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
const PW_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

class UserService {

  async createUser(data) {
    if (!data.email || !EMAIL_RE.test(data.email)) {
      throw new Error('Invalid email format')
    }

    if (!data.password || !PW_RE.test(data.password)) {
      throw new Error('Password must be 8+ chars with uppercase, lowercase, number & symbol')
    }

    const existing = await UserRepository.findByEmail(data.email)
    if (existing) throw new Error('Email already exists')

    const hashedPassword = await bcrypt.hash(data.password, 10)

    return await UserRepository.create({
      ...data,
      password: hashedPassword
    })
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id)
    if (!user) throw new Error('User not found')
    return user
  }

  async getAllUsers() {
    const users = await UserRepository.findAll()
    return users
  }

  async updateUser(id, data) {

    const payload = { ...data }

    if (payload.email && !EMAIL_RE.test(payload.email)) {
      throw new Error('Invalid email format')
    }

    if (payload.password && !PW_RE.test(payload.password)) {
      throw new Error('Password must be 8+ chars with uppercase, lowercase, number & symbol')
    }

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10)
    }

    const user = await UserRepository.update(id, payload)
    if (!user) throw new Error('User not found')

    return user
  }
}

export default new UserService()