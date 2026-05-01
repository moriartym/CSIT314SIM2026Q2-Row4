import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class ViewFRAService {
  async viewFRA(id) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    return fra
  }
}
export default new ViewFRAService()