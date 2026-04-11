import User from '../models/User.js'

class UserRepository {
  async create(data) {
    const user = new User(data)
    return await user.save()
  }

  async findById(id) {
    return await User.findById(id)
  }

}

export default new UserRepository()