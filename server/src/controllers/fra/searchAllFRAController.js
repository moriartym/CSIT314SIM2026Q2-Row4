import SearchAllFRAService from '../../services/fra/searchAllFRAService.js'

class SearchAllFRAController {
  async searchAllFRA(req, res) {
    try {
      const query  = req.query.query  || ''
      const status = req.query.status || 'active'
      const fras   = await SearchAllFRAService.searchAllFRA(query, status)
      res.status(200).json({ success: true, data: fras })
    } catch (error) {
      res.status(400).json({ success: false, message: error.message })
    }
  }
}
export default new SearchAllFRAController()