import UserRepository from '../../repositories/UserAccountRepository.js'
import bcrypt from 'bcrypt'

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
const PW_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

class CreateAccountService {
  async createAccount(data) {
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
}

export default new CreateAccountService()