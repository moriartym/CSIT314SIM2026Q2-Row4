import LogoutService from '../../services/auth/logoutService.js'

class LogoutController {
  async logout(req, res) {
    try {
      const result = await LogoutService.logout(req)
      res.json(result)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
}

export default new LogoutController()