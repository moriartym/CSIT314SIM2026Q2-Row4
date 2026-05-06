import ListAllFRAService from '../../services/fra/listAllFRAService.js'

class ListAllFRAController {
  async listAllFRA(req, res) {
    try {
      const status   = req.query.status   || 'active'
      const limit    = req.query.limit    || 5
      const skip     = req.query.skip     || 0
      const category = req.query.category || ''
      const result   = await ListAllFRAService.listAllFRA(status, limit, skip, category)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      res.status(400).json({ success: false, message: error.message })
    }
  }
}

export default new ListAllFRAController()