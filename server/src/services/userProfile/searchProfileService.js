import UserProfileRepository from '../../repositories/UserProfileRepository.js'

class SearchProfileService {
  async searchProfile(query) {
    if (!query || query.trim() === '') {
      return await UserProfileRepository.findAll()
    }
    return await UserProfileRepository.search(query)
  }
}

export default new SearchProfileService()