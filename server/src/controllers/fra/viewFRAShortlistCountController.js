import ViewFRAShortlistCountService from '../../services/fra/viewFRAShortlistCountService.js'
import mongoose from 'mongoose'

class ViewFRAShortlistCountController {
  async viewFRAShortlistCount(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ success: false, message: 'Fundraising activity not found' })
      const fra = await ViewFRAShortlistCountService.viewFRAShortlistCount(req.params.id)
      res.status(200).json({ success: true, message: 'Campaign shortlisted', data: fra })
    } catch (error) {
      if (error.message === 'Fundraising activity not found')
        return res.status(404).json({ success: false, message: error.message })
      if (error.message === 'Campaign is not active')
        return res.status(400).json({ success: false, message: error.message })
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ViewFRAShortlistCountController()