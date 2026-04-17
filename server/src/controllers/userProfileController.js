import UserProfileService from '../services/userProfileService.js'
import mongoose from 'mongoose'

class UserProfileController {
  async createUserProfile(req, res) {
    try {
      const userProfile = await UserProfileService.createUserProfile(req.body)
      res.status(201).json({ success: true, message: 'User Profile successfully created', data: userProfile })
    } catch (error) {
      if (error.message === 'Profile name already exists') {
        return res.status(400).json({ success: false, message: error.message })
      }
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async getAllUserProfiles(req, res) {
    try {
      const userProfiles = await UserProfileService.getAllUserProfiles()
      return res.status(200).json({ success: true, data: userProfiles })
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  async getUserProfileById(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'User Profile ID not found' })
      }
      const userProfile = await UserProfileService.getUserProfileById(req.params.id)
      res.status(200).json({ success: true, data: userProfile })
    } catch (error) {
      if (error.message === 'User profile not found') {
        return res.status(404).json({ success: false, message: 'User Profile ID not found' })
      }
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async updateUserProfile(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({
          success: false,
          message: 'User Profile was not found'
        })
      }

      const userProfile = await UserProfileService.updateUserProfile(
        req.params.id,
        req.body
      )

      res.status(200).json({
        success: true,
        message: 'User Profile successfully updated',
        data: userProfile
      })

    } catch (error) {
      if (error.message === 'User Profile was not found') {
        return res.status(404).json({
          success: false,
          message: 'User Profile was not found'
        })
      }

      return res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  async suspendUserProfile(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'User Profile ID not found' })
      }
      const userProfile = await UserProfileService.suspendUserProfile(req.params.id)
      res.status(200).json({ success: true, message: 'User Profile successfully suspended', data: userProfile })
    } catch (error) {
      if (error.message === 'User profile not found') {
        return res.status(404).json({ success: false, message: 'User Profile was not found' })
      }
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async searchUserProfiles(req, res) {
    try {
      const { query } = req.query
      if (!query) {
        return res.status(400).json({ success: false, message: 'Search query is required' })
      }
      const userProfiles = await UserProfileService.searchUserProfiles(query)
      res.status(200).json({ success: true, data: userProfiles })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new UserProfileController()