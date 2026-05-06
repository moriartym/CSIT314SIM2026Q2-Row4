import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class ListMyFRAService {
  async listMyFRA(userId, limit = 5, skip = 0, category = '') {
    return await FundraisingActivityRepository.findAllByUser(userId, limit, skip, category)
  }
}

export default new ListMyFRAService()