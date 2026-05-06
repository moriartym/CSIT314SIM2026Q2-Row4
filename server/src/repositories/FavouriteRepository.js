import Favourite from '../models/Favourite.js'

class FavouriteRepository {
  async create(doneeId, fraId) {
    const favourite = new Favourite({ donee: doneeId, fra: fraId })
    return await favourite.save()
  }
  
  async findById(id) {
    return await Favourite.findById(id).populate('fra')
  }

  async findByDonee(doneeId, limit = 5, skip = 0) {
    const all      = await Favourite.find({ donee: doneeId }).populate('fra', 'title status targetAmount category shortlistCount')
    const filtered = all.filter(f => f.fra?.status === 'active')
    const total    = filtered.length
    const data     = filtered.slice(Number(skip), Number(skip) + Number(limit))
    return { data, total }
  }

  async findByDoneeAndFra(doneeId, fraId) {
    return await Favourite.findOne({ donee: doneeId, fra: fraId })
  }

  async delete(doneeId, fraId) {
    return await Favourite.findOneAndDelete({ donee: doneeId, fra: fraId })
  }

  async searchByDonee(doneeId, query, limit = 5, skip = 0) {
    const all      = await Favourite.find({ donee: doneeId }).populate('fra', 'title status targetAmount category shortlistCount')
    const filtered = all.filter(f => f.fra?.status === 'active' && f.fra?.title?.match(new RegExp(query, 'i')))
    const total    = filtered.length
    const data     = filtered.slice(Number(skip), Number(skip) + Number(limit))
    return { data, total }
  }
  
  async removeByDoneeAndFra(doneeId, fraId) {
    return await Favourite.findOneAndDelete({ donee: doneeId, fra: fraId })
  }
}

export default new FavouriteRepository()