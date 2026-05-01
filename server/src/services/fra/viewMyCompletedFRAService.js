import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class ViewMyCompletedFRAService {
  async viewCompletedFRA(userId, filters) {
    return await FundraisingActivityRepository.findCompletedByUser(userId, filters)
  }
}

export default new ViewMyCompletedFRAService()