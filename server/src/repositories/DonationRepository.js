import mongoose from 'mongoose'
import Donation from '../models/Donation.js'

class DonationRepository {
  async create(data) {
    const donation = new Donation(data)
    return await donation.save()
  }

  async findByDonee(doneeId) {
    return await Donation.find({ donee: doneeId }).populate({
      path: 'fra',
      populate: { path: 'category', select: 'name' }
    })
  }

  async searchByDonee(doneeId, filters = {}) {
    const match = { donee: new mongoose.Types.ObjectId(doneeId) }
    if (filters.from) match.donatedAt = { ...match.donatedAt, $gte: new Date(filters.from) }
    if (filters.to)   match.donatedAt = { ...match.donatedAt, $lte: new Date(filters.to) }

    const donations = await Donation.find(match).populate({
      path: 'fra',
      populate: { path: 'category', select: 'name' }
    })

    if (filters.category) {
      return donations.filter(d =>
        d.fra?.category?._id?.toString() === filters.category.toString()
      )
    }

    return donations
  }
}

export default new DonationRepository()