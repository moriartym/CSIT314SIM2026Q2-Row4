import Favourite from '../models/Favourite.js'

class FavouriteRepository {
  async create(doneeId, fraId) {
    const favourite = new Favourite({ donee: doneeId, fra: fraId })
    return await favourite.save()
  }
  
  async findById(id) {
    return await Favourite.findById(id).populate('fra')
  }

  async findByDonee(doneeId) {
    return await Favourite.find({ donee: doneeId }).populate('fra', 'title status targetAmount category')
  }

  async findByDoneeAndFra(doneeId, fraId) {
    return await Favourite.findOne({ donee: doneeId, fra: fraId })
  }

  async delete(doneeId, fraId) {
    return await Favourite.findOneAndDelete({ donee: doneeId, fra: fraId })
  }

  async searchByDonee(doneeId, query) {
    const favourites = await Favourite.find({ donee: doneeId }).populate('fra', 'title status targetAmount category')
    return favourites.filter(f =>
      f.fra?.title?.match(new RegExp(query, 'i'))
    )
  }

  async removeByDoneeAndFra(doneeId, fraId) {
    return await Favourite.findOneAndDelete({ donee: doneeId, fra: fraId })
  }
}
export default new FavouriteRepository()