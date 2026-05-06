import '../models/UserAccount.js'
import mongoose from 'mongoose'
import FundraisingActivity from '../models/FundraisingActivity.js'
import Donation from '../models/Donation.js'

class FundraisingActivityRepository {

  async _attachProgress(fras) {
    if (!fras || fras.length === 0) return fras

    const ids = fras.map(f => f._id)

    const totals = await Donation.aggregate([
      { $match: { fra: { $in: ids } } },
      { $group: { _id: '$fra', totalRaised: { $sum: '$amount' } } },
    ])

    const map = {}
    totals.forEach(t => { map[t._id.toString()] = t.totalRaised })

    return fras.map(f => {
      const plain       = f.toObject ? f.toObject() : f
      plain.totalRaised = map[plain._id.toString()] ?? 0
      return plain
    })
  }

  async create(data) {
    const fra = new FundraisingActivity(data)
    return await fra.save()
  }

  async update(id, data) {
    return await FundraisingActivity
      .findByIdAndUpdate(id, data, { returnDocument: 'after' })
      .populate('category')
  }

  async toggleSuspend(id) {
    const fra = await FundraisingActivity.findById(id)
    if (!fra) return null
    const newStatus = fra.status === 'active' ? 'suspended' : 'active'
    return await FundraisingActivity
      .findByIdAndUpdate(id, { status: newStatus }, { returnDocument: 'after' })
      .populate('category')
  }

  async complete(id) {
    return await FundraisingActivity
      .findByIdAndUpdate(id, { status: 'completed', completedAt: new Date() }, { returnDocument: 'after' })
      .populate('category')
  }

  async incrementViewCount(id, userId) {
    return await FundraisingActivity.findOneAndUpdate(
      { _id: id, viewedBy: { $nin: [userId] }, createdBy: { $ne: userId } },
      { $inc: { viewCount: 1 }, $addToSet: { viewedBy: userId } },
      { returnDocument: 'after' }
    )
  }

  async incrementShortlistCount(id) {
    return await FundraisingActivity
      .findByIdAndUpdate(id, { $inc: { shortlistCount: 1 } }, { returnDocument: 'after' })
  }

  async decrementShortlistCount(id) {
    return await FundraisingActivity.findByIdAndUpdate(
      id,
      { $inc: { shortlistCount: -1 } },
      { returnDocument: 'after' }
    )
  }

  async findById(id) {
    const fra = await FundraisingActivity
      .findById(id)
      .populate('createdBy')
      .populate('category')

    if (!fra) return null
    const [result] = await this._attachProgress([fra])
    return result
  }

  async findAllByUser(userId, limit = 5, skip = 0, category = '') {
    const match = { createdBy: new mongoose.Types.ObjectId(userId) }
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      match.category = new mongoose.Types.ObjectId(category)
    }
    const [fras, total] = await Promise.all([
      FundraisingActivity.find(match)
        .select('title status targetAmount category viewCount shortlistCount')
        .populate('category', 'name')
        .skip(Number(skip))
        .limit(Number(limit)),
      FundraisingActivity.countDocuments(match)
    ])
    const data = await this._attachProgress(fras)
    return { data, total }
  }

  async findCompletedByUser(userId, filters = {}) {
    const match = { createdBy: userId, status: 'completed' }
    if (filters.category && mongoose.Types.ObjectId.isValid(filters.category)) {
      match.category = new mongoose.Types.ObjectId(filters.category)
    }
    if (filters.from) match.completedAt = { ...match.completedAt, $gte: new Date(filters.from) }
    if (filters.to)   match.completedAt = { ...match.completedAt, $lte: new Date(filters.to) }

    const fras = await FundraisingActivity
      .find(match)
      .select('title status targetAmount category viewCount shortlistCount completedAt')
      .populate('category', 'name')
    return this._attachProgress(fras)
  }

  async searchByUser(userId, query, limit = 5, skip = 0, category = '') {
    if (!query || !query.trim()) throw new Error('Search query is required')
    const match = {
      createdBy: new mongoose.Types.ObjectId(userId),
      title: { $regex: query.trim(), $options: 'i' }
    }
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      match.category = new mongoose.Types.ObjectId(category)
    }
    const [fras, total] = await Promise.all([
      FundraisingActivity.find(match)
        .select('title status targetAmount category viewCount shortlistCount')
        .populate('category', 'name')
        .skip(Number(skip))
        .limit(Number(limit)),
      FundraisingActivity.countDocuments(match)
    ])
    const data = await this._attachProgress(fras)
    return { data, total }
  }

  async listAll(status = 'active', limit = 5, skip = 0, category = '') {
    const match = { status }
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      match.category = new mongoose.Types.ObjectId(category)
    }
    const [fras, total] = await Promise.all([
      FundraisingActivity.find(match)
        .select('title status targetAmount category viewCount shortlistCount completedAt')
        .populate('createdBy', 'username')
        .populate('category', 'name')
        .skip(Number(skip))
        .limit(Number(limit)),
      FundraisingActivity.countDocuments(match)
    ])
    const data = await this._attachProgress(fras)
    return { data, total }
  }

  async searchAll(query, status = 'active', limit = 5, skip = 0, category = '') {
    if (!query || !query.trim()) throw new Error('Search query is required')
    const match = { status, title: { $regex: query.trim(), $options: 'i' } }
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      match.category = new mongoose.Types.ObjectId(category)
    }
    const [fras, total] = await Promise.all([
      FundraisingActivity.find(match)
        .select('title status targetAmount category viewCount shortlistCount completedAt')
        .populate('createdBy', 'username')
        .populate('category', 'name')
        .skip(Number(skip))
        .limit(Number(limit)),
      FundraisingActivity.countDocuments(match)
    ])
    const data = await this._attachProgress(fras)
    return { data, total }
  }

  async findByDateRange(from, to) {
    const fras = await FundraisingActivity.find({
      createdAt: { $gte: from, $lte: to },
    })
      .populate('createdBy')
      .populate('category')
    return this._attachProgress(fras)
  }
}

export default new FundraisingActivityRepository()