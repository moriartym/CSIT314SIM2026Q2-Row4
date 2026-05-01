import UserAccount from '../models/UserAccount.js'

class UserRepository {
  async create(data) {
    const userAccount = new UserAccount(data)
    return await userAccount.save()
  }

  async findById(id) {
    return await UserAccount.findById(id).populate('userProfile')
  }

  async findByUsername(username) {
    return await UserAccount.findOne({ username }).populate('userProfile')
  } 

  async findByEmail(email) {
    return await UserAccount.findOne({ email }).populate('userProfile')
  }

  async findAll() {
      return await UserAccount.find().select('username email isActive userProfile').populate('userProfile')
  }
  
  async toggleSuspend(id) {
    const userAccount = await UserAccount.findById(id)
    if (!userAccount) return null

    return await UserAccount.findByIdAndUpdate(
      id,
      { isActive: !userAccount.isActive },
      { returnDocument: 'after' }
    )
  }

  async update(id, data) {
    return await UserAccount.findByIdAndUpdate(id, data, { returnDocument: 'after' })
  }

  async search(query) {
      return await UserAccount.find({
          username: { $regex: query, $options: 'i' }
      }).select('username email isActive userProfile').populate('userProfile')
  }
}

export default new UserRepository()