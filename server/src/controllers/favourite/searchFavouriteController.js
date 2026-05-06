import SearchFavouriteService from '../../services/favourite/searchFavouriteService.js'

class SearchFavouriteController {
  async searchFavourite(req, res) {
    try {
      const query = req.query.query
      const limit = req.query.limit || 5
      const skip  = req.query.skip  || 0
      if (!query || !query.trim()) {
        return res.status(400).json({ success: false, message: 'Search query is required' })
      }
      const result = await SearchFavouriteService.searchFavourite(req.userAccount._id.toString(), query, limit, skip)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new SearchFavouriteController()