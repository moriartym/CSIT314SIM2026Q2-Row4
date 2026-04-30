import UpdateProfileService from '../../services/userProfile/updateProfileService.js'
import mongoose from 'mongoose'

class UpdateProfileController {
  async updateProfile(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'User Profile was not found' })
      }
      const userProfile = await UpdateProfileService.updateProfile(req.params.id, req.body)
      res.status(200).json({ success: true, message: 'User Profile successfully updated', data: userProfile })
    } catch (error) {
      if (error.message === 'User Profile was not found') {
        return res.status(404).json({ success: false, message: 'User Profile was not found' })
      }
      return res.status(400).json({ success: false, message: error.message })
    }
  }
}

export default new UpdateProfileController()