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
  async updateUserById(id, data) {
    // Check if user exists
    const user = await UserRepository.findById(id)
    if (!user) throw new Error('User not found')
  
    // If password is being updated, hash it
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    }
  
    // Update user
    const updatedUser = await UserRepository.updateById(id, data)
  
    return updatedUser
  }

}

export default new UserService()
