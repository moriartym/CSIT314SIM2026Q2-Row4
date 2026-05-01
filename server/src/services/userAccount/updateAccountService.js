import UserRepository from '../../repositories/UserAccountRepository.js'
import bcrypt from 'bcrypt'

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
const PW_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

class UpdateAccountService {
  async updateAccount(id, data) {
    const existingUser = await UserRepository.findById(id)
    if (!existingUser) throw new Error('User not found')

    if (data.email) {
      if (!EMAIL_RE.test(data.email)) {
        throw new Error('Invalid email format')
      }
      const duplicateEmail = await UserRepository.findByEmail(data.email)
      if (duplicateEmail && duplicateEmail._id.toString() !== id) {
        throw new Error('Email already exists')
      }
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
}

export default new UpdateAccountService()