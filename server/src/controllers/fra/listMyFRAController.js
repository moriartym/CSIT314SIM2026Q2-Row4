import ListMyFRAService from '../../services/fra/listMyFRAService.js'

class ListMyFRAController {
  async listMyFRA(req, res) {
    try {
      const limit    = req.query.limit    || 5
      const skip     = req.query.skip     || 0
      const category = req.query.category || ''
      const result   = await ListMyFRAService.listMyFRA(req.userAccount._id.toString(), limit, skip, category)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ListMyFRAController()