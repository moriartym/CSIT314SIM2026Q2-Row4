import UserProfileRepository from '../../repositories/UserProfileRepository.js'

const VALID_PERMISSIONS = ['user_management', 'fundraising', 'donating', 'platform_management']

class CreateProfileService {
  async createProfile(data) {
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
}

export default new CreateProfileService()