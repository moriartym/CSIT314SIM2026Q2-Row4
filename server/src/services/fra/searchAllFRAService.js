import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class SearchAllFRAService {
  async searchAllFRA(query, status = 'active', limit = 5, skip = 0, category = '') {
    return await FundraisingActivityRepository.searchAll(query, status, limit, skip, category)
  }
}

export default new SearchAllFRAService()