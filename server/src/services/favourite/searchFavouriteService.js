import FavouriteRepository from '../../repositories/FavouriteRepository.js'

class SearchFavouriteService {
  async searchFavourite(doneeId, query, limit = 5, skip = 0) {
    if (!query || !query.trim()) throw new Error('Search query is required')
    return await FavouriteRepository.searchByDonee(doneeId, query, limit, skip)
  }
}

export default new SearchFavouriteService()