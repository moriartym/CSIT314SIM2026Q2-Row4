import FavouriteRepository from '../../repositories/FavouriteRepository.js'
import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class ViewFavouriteService {
  async viewFavourite(favId, doneeId) {
    const favourite = await FavouriteRepository.findById(favId)
    if (!favourite) throw new Error('Favourite not found')
    if (favourite.donee.toString() !== doneeId) throw new Error('Unauthorized')
    const withProgress = await FundraisingActivityRepository._attachProgress([favourite.fra])
    const plain = favourite.toObject ? favourite.toObject() : favourite
    if (plain.fra) plain.fra.totalRaised = withProgress[0]?.totalRaised ?? 0
    return plain
  }
}
export default new ViewFavouriteService()