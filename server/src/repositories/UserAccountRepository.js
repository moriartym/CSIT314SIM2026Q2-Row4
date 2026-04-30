import User from '../models/UserAccount.js'

class UserRepository {
  async create(data) {
    const user = new User(data)
    return await user.save()
  }

  async findById(id) {
    return await User.findById(id).populate('userProfile')
  }

  async findByUsername(username) {
    return await User.findOne({ username }).populate('userProfile')
  } 

  async findByEmail(email) {
    return await User.findOne({ email }).populate('userProfile')
  }

  async findAll() {
    return await User.find().populate('userProfile')
  }
  
  async toggleSuspend(id) {
    const user = await User.findById(id)
    if (!user) return null

    return await User.findByIdAndUpdate(
      id,
      { isActive: !user.isActive },
      { new: true }
    )
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { returnDocument: 'after' })
  }

  async search(query) {
    return await User.find({
      username: { $regex: query, $options: 'i' }
    })
  }
}

export default new UserRepository()