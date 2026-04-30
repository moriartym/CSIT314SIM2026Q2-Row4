import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class ViewCompletedFRAService {
  async viewCompletedFRA(userId, filters) {
    return await FundraisingActivityRepository.findCompletedByUser(userId, filters)
  }
}

export default new ViewCompletedFRAService()