import ViewFRAService from '../../services/fra/viewFRAService.js'
import mongoose from 'mongoose'

class ViewFRAController {
  async viewFRA(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ success: false, message: 'Fundraising activity not found' })
      const fra = await ViewFRAService.viewFRA(req.params.id, req.user._id.toString())
      res.status(200).json({ success: true, data: fra })
    } catch (error) {
      if (error.message === 'Unauthorized')
        return res.status(403).json({ success: false, message: error.message })
      if (error.message === 'Fundraising activity not found')
        return res.status(404).json({ success: false, message: error.message })
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ViewFRAController()