import ViewProfileService from '../../services/userProfile/viewProfileService.js'
import mongoose from 'mongoose'

class ViewProfileController {
  async viewProfile(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'User Profile ID not found' })
      }
      const userProfile = await ViewProfileService.viewProfile(req.params.id)
      res.status(200).json({ success: true, data: userProfile })
    } catch (error) {
      if (error.message === 'User profile not found') {
        return res.status(404).json({ success: false, message: 'User Profile ID not found' })
      }
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ViewProfileController()