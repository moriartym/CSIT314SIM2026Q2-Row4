import SearchFRAService from '../../services/fra/searchFRAService.js'

class SearchFRAController {
  async searchFRA(req, res) {
    try {
      const { query } = req.query
      if (!query) return res.status(400).json({ success: false, message: 'Search query is required' })
      const fras = await SearchFRAService.searchFRA(req.userAccount._id.toString(), query)
      res.status(200).json({ success: true, data: fras })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new SearchFRAController()