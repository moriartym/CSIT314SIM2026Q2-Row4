import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class ViewMyFRAService {
  async viewMyFRA(userId) {
    return await FundraisingActivityRepository.findAllByUser(userId)
  }
}

export default new ViewMyFRAService()