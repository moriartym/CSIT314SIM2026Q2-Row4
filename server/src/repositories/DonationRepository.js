import mongoose from 'mongoose'
import Donation from '../models/Donation.js'

class DonationRepository {
  async create(data) {
    const donation = new Donation(data)
    return await donation.save()
  }

  async findByDonee(doneeId, filters = {}, limit = 5, skip = 0) {
    const match = { donee: new mongoose.Types.ObjectId(doneeId) }
    if (filters.from) match.donatedAt = { ...match.donatedAt, $gte: new Date(filters.from) }
    if (filters.to)   match.donatedAt = { ...match.donatedAt, $lte: new Date(filters.to) }

    let donations = await Donation.find(match).populate({
      path: 'fra', populate: { path: 'category', select: 'name' }
    })

    if (filters.category) {
      donations = donations.filter(d => d.fra?.category?._id?.toString() === filters.category.toString())
    }

    const total = donations.length
    const data  = donations.slice(Number(skip), Number(skip) + Number(limit))
    return { data, total }
  }

  async searchByDonee(doneeId, filters = {}, limit = 5, skip = 0) {
    if (!filters.query || !filters.query.trim()) throw new Error('Search query is required')
    const match = { donee: new mongoose.Types.ObjectId(doneeId) }
    if (filters.from) match.donatedAt = { ...match.donatedAt, $gte: new Date(filters.from) }
    if (filters.to)   match.donatedAt = { ...match.donatedAt, $lte: new Date(filters.to) }

    let donations = await Donation.find(match).populate({
      path: 'fra', populate: { path: 'category', select: 'name' }
    })

    if (filters.category) {
      donations = donations.filter(d => d.fra?.category?._id?.toString() === filters.category.toString())
    }
    donations = donations.filter(d => d.fra?.title?.match(new RegExp(filters.query.trim(), 'i')))

    const total = donations.length
    const data  = donations.slice(Number(skip), Number(skip) + Number(limit))
    return { data, total }
  }
}

export default new DonationRepository()