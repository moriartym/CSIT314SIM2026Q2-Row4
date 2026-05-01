import SuspendMyFRAService from '../../services/fra/suspendMyFRAService.js'
import mongoose from 'mongoose'

class SuspendMyFRAController {
  async suspendFRA(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ success: false, message: 'Fundraising activity not found' })
      const fra = await SuspendMyFRAService.suspendFRA(req.params.id, req.userAccount._id.toString())
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

export default new SuspendMyFRAController()