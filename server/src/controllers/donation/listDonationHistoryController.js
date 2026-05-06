import ListDonationHistoryService from '../../services/donation/listDonationHistoryService.js'

class ListDonationHistoryController {
  async listDonationHistory(req, res) {
    try {
      const { category, from, to } = req.query
      const limit   = req.query.limit || 5
      const skip    = req.query.skip  || 0
      const filters = { category, from, to }
      const result  = await ListDonationHistoryService.listDonationHistory(req.userAccount._id.toString(), filters, limit, skip)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ListDonationHistoryController()