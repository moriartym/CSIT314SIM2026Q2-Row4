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

    const existingEmail = await UserRepository.findByEmail(data.email)
    if (existingEmail) throw new Error('Email already exists')

    const existingUsername = await UserRepository.findByUsername(data.username)
    if (existingUsername) throw new Error('Username already exists')

    const hashedPassword = await bcrypt.hash(data.password, 10)
    return await UserRepository.create({ ...data, password: hashedPassword })
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id)
    if (!user) throw new Error('User not found')
    return user
  }

  async getAllUsers() {
    return await UserRepository.findAll()
  }

  async updateUser(id, data) {
    const existingUser = await UserRepository.findById(id)
    if (!existingUser) throw new Error('User not found')

    if (data.email && !EMAIL_RE.test(data.email)) {
      throw new Error('Invalid email format')
    }

    if (data.password && !PW_RE.test(data.password)) {
      throw new Error('Password must be 8+ chars with uppercase, lowercase, number & symbol')
    }

    if (data.username) {
      const duplicate = await UserRepository.findByUsername(data.username)
      if (duplicate && duplicate._id.toString() !== id) {
        throw new Error('Username already exists')
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    }

    return await UserRepository.update(id, data)
  }

  async suspendUser(id) {
    const user = await UserRepository.toggleSuspend(id)
    if (!user) throw new Error('User not found')
    return user
  }

  async searchUsers(query) {
    if (!query || query.trim() === '') throw new Error('Search query is required')
    return await UserRepository.search(query)
  }
}

export default new UserService()