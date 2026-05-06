import SearchDonationHistoryService from '../../services/donation/searchDonationHistoryService.js'

class SearchDonationHistoryController {
  async searchDonationHistory(req, res) {
    try {
      const { category, from, to, query } = req.query
      const limit   = req.query.limit || 5
      const skip    = req.query.skip  || 0
      if (!query || !query.trim()) {
        return res.status(400).json({ success: false, message: 'Search query is required' })
      }
      const filters = { category, from, to, query }
      const result  = await SearchDonationHistoryService.searchDonationHistory(req.userAccount._id.toString(), filters, limit, skip)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new SearchDonationHistoryController()