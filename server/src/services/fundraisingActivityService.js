import FundraisingActivityRepository from '../repositories/FundraisingActivityRepository.js'

class FundraisingActivityService {
  async createFRA(data, userId) {
    if (!data.title || data.title.trim() === '') throw new Error('Title is required')
    if (!data.targetAmount || data.targetAmount <= 0) throw new Error('Target amount must be greater than 0')
    return await FundraisingActivityRepository.create({ ...data, createdBy: userId })
  }

  async getMyFRAs(userId) {
    return await FundraisingActivityRepository.findAllByUser(userId)
  }

  async getFRAById(id, userId) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    if (fra.createdBy._id.toString() !== userId) throw new Error('Unauthorized')
    return fra
  }

  async updateFRA(id, data, userId) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    if (fra.createdBy._id.toString() !== userId) throw new Error('Unauthorized')
    if (data.title !== undefined && data.title.trim() === '') throw new Error('Title cannot be empty')
    if (data.targetAmount && data.targetAmount <= 0) throw new Error('Target amount must be greater than 0')
    return await FundraisingActivityRepository.update(id, data)
  }

  async suspendFRA(id, userId) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    if (fra.createdBy._id.toString() !== userId) throw new Error('Unauthorized')
    return await FundraisingActivityRepository.toggleSuspend(id)
  }

  async searchMyFRAs(userId, query) {
    if (!query || query.trim() === '') throw new Error('Search query is required')
    return await FundraisingActivityRepository.searchByUser(userId, query)
  }

  async getCompletedFRAs(userId, filters) {
    return await FundraisingActivityRepository.findCompletedByUser(userId, filters)
  }

  async getAllActiveFRAs() {
    return await FundraisingActivityRepository.findAllActive()
  }

  async completeFRA(id, userId) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    if (fra.createdBy._id.toString() !== userId) throw new Error('Unauthorized')
    if (fra.status === 'completed') throw new Error('Campaign is already completed')
    return await FundraisingActivityRepository.complete(id)
  }

  async searchAllFRAs(query) {
    if (!query || query.trim() === '') throw new Error('Search query is required')
    return await FundraisingActivityRepository.searchAll(query)
  }

  async shortlistFRA(id) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    if (fra.status !== 'active') throw new Error('Campaign is not active')
    return await FundraisingActivityRepository.incrementShortlistCount(id)
  }

  async recordView(id) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    return await FundraisingActivityRepository.incrementViewCount(id)
  }
}

export default new FundraisingActivityService()