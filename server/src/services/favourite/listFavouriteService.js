import FavouriteRepository from '../../repositories/FavouriteRepository.js'

class ListFavouriteService {
  async listFavourite(doneeId, limit = 5, skip = 0) {
    return await FavouriteRepository.findByDonee(doneeId, limit, skip)
  }
}

export default new ListFavouriteService()