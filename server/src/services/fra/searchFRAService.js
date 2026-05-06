import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class SearchFRAService {
  async searchFRA(userId, query, limit = 5, skip = 0, category = '') {
    if (!query || query.trim() === '') throw new Error('Search query is required')
    return await FundraisingActivityRepository.searchByUser(userId, query, limit, skip, category)
  }
}

export default new SearchFRAService()