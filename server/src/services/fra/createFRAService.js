import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class CreateFRAService {
  async createFRA(data, userId) {
    if (!data.title || data.title.trim() === '') throw new Error('Title is required')
    if (!data.targetAmount || data.targetAmount <= 0) throw new Error('Target amount must be greater than 0')
    return await FundraisingActivityRepository.create({ ...data, createdBy: userId })
  }
}

export default new CreateFRAService()