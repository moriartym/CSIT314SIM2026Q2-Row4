import FundraisingActivity from '../models/FundraisingActivity.js'

class FundraisingActivityRepository {
  async create(data) {
    const fra = new FundraisingActivity(data)
    return await fra.save()
  }

  async findById(id) {
    return await FundraisingActivity.findById(id).populate('createdBy')
  }

  async findAllByUser(userId) {
    return await FundraisingActivity.find({ createdBy: userId })
  }

  async findAllActive() {
    return await FundraisingActivity.find({ status: 'active' }).populate('createdBy')
  }

  async findCompletedByUser(userId, filters = {}) {
    const match = { createdBy: userId, status: 'completed' }
    if (filters.category) match.category = { $regex: filters.category, $options: 'i' }
    if (filters.from) match.completedAt = { ...match.completedAt, $gte: new Date(filters.from) }
    if (filters.to)   match.completedAt = { ...match.completedAt, $lte: new Date(filters.to) }
    return await FundraisingActivity.find(match)
  }

  async update(id, data) {
    return await FundraisingActivity.findByIdAndUpdate(id, data, { returnDocument: 'after' })
  }

  async toggleSuspend(id) {
    const fra = await FundraisingActivity.findById(id)
    if (!fra) return null
    const newStatus = fra.status === 'active' ? 'suspended' : 'active'
    return await FundraisingActivity.findByIdAndUpdate(id, { status: newStatus }, { returnDocument: 'after' })
  }

  async searchByUser(userId, query) {
    return await FundraisingActivity.find({
      createdBy: userId,
      title: { $regex: query, $options: 'i' }
    })
  }

  async complete(id) {
    return await FundraisingActivity.findByIdAndUpdate(
        id,
        { status: 'completed', completedAt: new Date() },
        { returnDocument: 'after' }
    )
  }

  async searchAll(query) {
    return await FundraisingActivity.find({
      status: 'active',
      title: { $regex: query, $options: 'i' }
    }).populate('createdBy')
  }

  async incrementViewCount(id) {
    return await FundraisingActivity.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { returnDocument: 'after' })
  }

  async incrementShortlistCount(id) {
    return await FundraisingActivity.findByIdAndUpdate(id, { $inc: { shortlistCount: 1 } }, { returnDocument: 'after' })
  }
}

export default new FundraisingActivityRepository()