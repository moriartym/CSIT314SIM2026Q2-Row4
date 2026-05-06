import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class ListAllFRAService {
  async listAllFRA(status = 'active', limit = 5, skip = 0, category = '') {
    return await FundraisingActivityRepository.listAll(status, limit, skip, category)
  }
}

export default new ListAllFRAService()