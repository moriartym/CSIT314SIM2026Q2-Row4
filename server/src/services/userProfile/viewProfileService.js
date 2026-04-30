import UserProfileRepository from '../../repositories/UserProfileRepository.js'

class ViewProfileService {
  async viewProfile(id) {
    const userProfile = await UserProfileRepository.findById(id)
    if (!userProfile) throw new Error('User profile not found')
    return userProfile
  }
}

export default new ViewProfileService()