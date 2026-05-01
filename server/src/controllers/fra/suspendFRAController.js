import SuspendFRAService from '../../services/fra/suspendFRAService.js'
import mongoose from 'mongoose'

class SuspendFRAController {
  async suspendFRA(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ success: false, message: 'Fundraising activity not found' })
      const fra = await SuspendFRAService.suspendFRA(req.params.id, req.userAccount._id.toString())
      res.status(200).json({ success: true, message: 'Fundraising activity successfully suspended', data: fra })
    } catch (error) {
      if (error.message === 'Unauthorized')
        return res.status(403).json({ success: false, message: error.message })
      if (error.message === 'Fundraising activity not found')
        return res.status(404).json({ success: false, message: error.message })
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new SuspendFRAController()