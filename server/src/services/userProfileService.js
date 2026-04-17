import UserProfileRepository from '../repositories/UserProfileRepository.js'

const VALID_PERMISSIONS = ['user_management', 'fundraising', 'donating', 'platform_management']

class UserProfileService {
  async createUserProfile(data) {
    if (!data.profileName || data.profileName.trim() === '') {
      throw new Error('Profile name is required')
    }
    if (!data.permissions || data.permissions.length === 0) {
      throw new Error('At least one permission is required')
    }
    const existing = await UserProfileRepository.findByProfileName(data.profileName)
    if (existing) throw new Error('Profile name already exists')
    const invalid = data.permissions.filter(p => !VALID_PERMISSIONS.includes(p))
    if (invalid.length) throw new Error(`Invalid permissions: ${invalid.join(', ')}`)
    return await UserProfileRepository.create(data)
  }

  async getUserProfileById(id) {
    const userProfile = await UserProfileRepository.findById(id)
    if (!userProfile) throw new Error('User profile not found')
    return userProfile
  }

  async getAllUserProfiles() {
    return await UserProfileRepository.findAll()
  }

  async updateUserProfile(id, data) {
    const existingProfile = await UserProfileRepository.findById(id)
    if (!existingProfile) throw new Error('User Profile was not found')
    if (data.profileName && data.profileName.trim() === '') {
      throw new Error('Profile name cannot be empty')
    }
    if (data.profileName) {
      const duplicate = await UserProfileRepository.findByProfileName(data.profileName)
      if (duplicate && duplicate._id.toString() !== id) {
        throw new Error('Profile name already exists')
      }
    }
    if (!data.permissions || data.permissions.length === 0) {
      throw new Error('At least one permission is required')
    }
    const invalid = data.permissions.filter(p => !VALID_PERMISSIONS.includes(p))
    if (invalid.length) throw new Error(`Invalid permissions: ${invalid.join(', ')}`)
    return await UserProfileRepository.update(id, data)
  }

  async suspendUserProfile(id) {
    const userProfile = await UserProfileRepository.toggleSuspend(id)
    if (!userProfile) throw new Error('User profile not found')
    return userProfile
  }

  async searchUserProfiles(query) {
    if (!query || query.trim() === '') throw new Error('Search query is required')
    return await UserProfileRepository.search(query)
  }
}

export default new UserProfileService()