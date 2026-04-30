import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class ViewAllActiveFRAService {
  async viewAllActiveFRA() {
    return await FundraisingActivityRepository.findAllActive()
  }
}

export default new ViewAllActiveFRAService()