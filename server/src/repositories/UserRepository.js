import User from '../models/User.js'

class UserRepository {
  async create(data) {
    const user = new User(data)
    return await user.save()
  }

  async findById(id) {
    return await User.findById(id)
  }

  async findByEmail(email) {
    return await User.findOne({ email })
  }

  async findAll() {
    return await User.find()
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { returnDocument: 'after' })
  }
}

export default new UserRepository()