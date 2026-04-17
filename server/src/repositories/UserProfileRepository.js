import UserProfile from '../models/UserProfile.js'

class UserProfileRepository {
  async create(data) {
    const userProfile = new UserProfile(data)
    return await userProfile.save()
  }

  async findById(id) {
    return await UserProfile.findById(id)
  }

  async findByProfileName(profileName) {
    return await UserProfile.findOne({ profileName })
  }

  async findAll() {
    return await UserProfile.find()
  }

  async update(id, data) {
    return await UserProfile.findByIdAndUpdate(id, data, { returnDocument: 'after' })
  }

  async toggleSuspend(id) {
    const userProfile = await UserProfile.findById(id)
    if (!userProfile) return null

    return await UserProfile.findByIdAndUpdate(
      id,
      { isActive: !userProfile.isActive },
      { new: true }
    )
  }

  async search(query) {
    return await UserProfile.find({
      profileName: { $regex: query, $options: 'i' }
    })
  }
}

export default new UserProfileRepository()