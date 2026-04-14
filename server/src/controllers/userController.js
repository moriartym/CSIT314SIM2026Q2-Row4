import UserService from '../services/userService.js'
import mongoose from 'mongoose'

class UserController {
  async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body)
      res.status(201).json({ success: true, message: 'User Account successfully created', data: user })
    } catch (error) {
      if (error.message === 'Email already exists') {
        return res.status(400).json({ success: false, message: error.message })
      }
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers()

      return res.status(200).json({
        success: true,
        data: users
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }

  async getUserById(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'User ID not found' })
      }
      const user = await UserService.getUserById(req.params.id)
      res.status(200).json({ success: true, data: user })
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: 'User ID not found' })
      }
      res.status(404).json({ success: false, message: error.message })
    }
  }

  async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body)
      res.status(200).json({ success: true, message: 'User Account successfully updated', data: user })
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: 'User account was not found' })
      }
      res.status(400).json({ success: false, message: error.message })
    }
  }
}

export default new UserController()