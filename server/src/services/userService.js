import UserRepository from '../repositories/UserRepository.js'
import bcrypt from 'bcrypt'

class UserService {
  async createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return await UserRepository.create({ ...data, password: hashedPassword })
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id)
    if (!user) throw new Error('User not found')
    return user
  }


}

export default new UserService()