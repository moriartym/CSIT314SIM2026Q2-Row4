import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class SearchAllFRAService {
  async searchAllFRA(query, status = 'active') {
    return await FundraisingActivityRepository.searchAll(query, status)
  }
}

export default new SearchAllFRAService()