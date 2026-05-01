import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class MarkCompleteFRAService {
  async completeFRA(id, userId) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    if (fra.createdBy._id.toString() !== userId) throw new Error('Unauthorized')
    if (fra.status === 'completed') throw new Error('Campaign is already completed')
    return await FundraisingActivityRepository.complete(id)
  }
}

export default new MarkCompleteFRAService()