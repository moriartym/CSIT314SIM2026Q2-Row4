import UserProfileRepository from '../../repositories/UserProfileRepository.js'

const VALID_PERMISSIONS = ['user_management', 'fundraising', 'donating', 'platform_management']

class UpdateProfileService {
  async updateProfile(id, data) {
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
}

export default new UpdateProfileService()