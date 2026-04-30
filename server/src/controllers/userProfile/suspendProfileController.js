import SuspendProfileService from '../../services/userProfile/suspendProfileService.js'
import mongoose from 'mongoose'

class SuspendProfileController {
  async suspendProfile(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'User Profile ID not found' })
      }
      const userProfile = await SuspendProfileService.suspendProfile(req.params.id)
      res.status(200).json({ success: true, message: 'User Profile successfully suspended', data: userProfile })
    } catch (error) {
      if (error.message === 'User profile not found') {
        return res.status(404).json({ success: false, message: 'User Profile was not found' })
      }
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new SuspendProfileController()