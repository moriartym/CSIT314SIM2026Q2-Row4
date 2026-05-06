import SearchFRAService from '../../services/fra/searchFRAService.js'

class SearchFRAController {
  async searchFRA(req, res) {
    try {
      const { query } = req.query
      const limit    = req.query.limit    || 5
      const skip     = req.query.skip     || 0
      const category = req.query.category || ''
      if (!query || !query.trim()) {
        return res.status(400).json({ success: false, message: 'Search query is required' })
      }
      const result = await SearchFRAService.searchFRA(req.userAccount._id.toString(), query, limit, skip, category)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new SearchFRAController()