import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class ViewFRAService {
  async viewFRA(id, userId) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    if (fra.createdBy._id.toString() !== userId) throw new Error('Unauthorized')
    return fra
  }
}

export default new ViewFRAService()