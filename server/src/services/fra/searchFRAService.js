import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class SearchFRAService {
  async searchFRA(userId, query) {
    if (!query || query.trim() === '') throw new Error('Search query is required')
    return await FundraisingActivityRepository.searchByUser(userId, query)
  }
}

export default new SearchFRAService()