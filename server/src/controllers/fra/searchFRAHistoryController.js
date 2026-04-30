import SearchFRAHistoryService from '../../services/fra/searchFRAHistoryService.js'

class SearchFRAHistoryController {
  async searchFRAHistory(req, res) {
    try {
      const fras = await SearchFRAHistoryService.searchFRAHistory(req.user._id.toString(), req.query)
      res.status(200).json({ success: true, data: fras })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new SearchFRAHistoryController()