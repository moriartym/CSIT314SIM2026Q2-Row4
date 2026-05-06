import SearchAllFRAService from '../../services/fra/searchAllFRAService.js'

class SearchAllFRAController {
  async searchAllFRA(req, res) {
    try {
      const query    = req.query.query
      const status   = req.query.status   || 'active'
      const limit    = req.query.limit    || 5
      const skip     = req.query.skip     || 0
      const category = req.query.category || ''
      if (!query || !query.trim()) {
        return res.status(400).json({ success: false, message: 'Search query is required' })
      }
      const result = await SearchAllFRAService.searchAllFRA(query, status, limit, skip, category)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      res.status(400).json({ success: false, message: error.message })
    }
  }
}

export default new SearchAllFRAController()