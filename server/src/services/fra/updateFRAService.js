import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class UpdateFRAService {
  async updateFRA(id, data, userId) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    if (fra.createdBy._id.toString() !== userId) throw new Error('Unauthorized')
    if (data.title !== undefined && data.title.trim() === '') throw new Error('Title cannot be empty')
    if (data.targetAmount && data.targetAmount <= 0) throw new Error('Target amount must be greater than 0')
    return await FundraisingActivityRepository.update(id, data)
  }
}

export default new UpdateFRAService()