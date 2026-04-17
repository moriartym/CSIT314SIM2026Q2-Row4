import authService from '../services/authService.js'
import UserRepository from '../repositories/UserRepository.js'

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body
      const user = await authService.login(username, password, req)
      res.json(user)
    } catch (err) {
      res.status(401).json({ message: err.message })
    }
  }

  async logout(req, res) {
    try {
      const result = await authService.logout(req)
      res.json(result)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }

  async me(req, res) {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' })
      }
      const user = await UserRepository.findById(req.session.userId)
      if (!user) return res.status(401).json({ success: false, message: 'User not found' })
      res.json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          userProfile: user.userProfile
        }
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new AuthController()