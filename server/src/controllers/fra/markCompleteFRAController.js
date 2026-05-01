import MarkCompleteFRAService from '../../services/fra/markCompleteFRAService.js'
import mongoose from 'mongoose'

class MarkCompleteFRAController {
  async completeFRA(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ success: false, message: 'Fundraising activity not found' })
      const fra = await MarkCompleteFRAService.completeFRA(req.params.id, req.userAccount._id.toString())
      res.status(200).json({ success: true, message: 'Fundraising activity successfully completed', data: fra })
    } catch (error) {
      if (error.message === 'Unauthorized')
        return res.status(403).json({ success: false, message: error.message })
      if (error.message === 'Fundraising activity not found')
        return res.status(404).json({ success: false, message: error.message })
      if (error.message === 'Campaign is already completed')
        return res.status(400).json({ success: false, message: error.message })
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new MarkCompleteFRAController()