import CreateProfileService from '../../services/userProfile/createProfileService.js'

class CreateProfileController {
  async createProfile(req, res) {
    try {
      const userProfile = await CreateProfileService.createProfile(req.body)
      res.status(201).json({ success: true, message: 'User Profile successfully created', data: userProfile })
    } catch (error) {
      if (error.message === 'Profile name already exists') {
        return res.status(400).json({ success: false, message: error.message })
      }
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new CreateProfileController()