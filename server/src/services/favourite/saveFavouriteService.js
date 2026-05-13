import FavouriteRepository from '../../repositories/FavouriteRepository.js'
import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class SaveFavouriteService {
  async saveFavourite(doneeId, fraId) {
    const existing = await FavouriteRepository.findByDoneeAndFra(doneeId, fraId)
    if (existing) return existing
    const result = await FavouriteRepository.create(doneeId, fraId)
    await FundraisingActivityRepository.incrementShortlistCount(fraId)
    return result
  }
}
export default new SaveFavouriteService()