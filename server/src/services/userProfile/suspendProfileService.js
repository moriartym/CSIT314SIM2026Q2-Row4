import UserProfileRepository from '../../repositories/UserProfileRepository.js'

class SuspendProfileService {
  async suspendProfile(id) {
    const userProfile = await UserProfileRepository.toggleSuspend(id)
    if (!userProfile) throw new Error('User profile not found')
    return userProfile
  }
}

export default new SuspendProfileService()