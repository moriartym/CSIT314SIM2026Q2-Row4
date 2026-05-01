import CreateAccountService from '../../services/userAccount/createAccountService.js'

class CreateAccountController {
  async createAccount(req, res) {
    try {
      const userAccount = await CreateAccountService.createAccount(req.body)
      res.status(201).json({ success: true, message: 'User Account successfully created', data: userAccount })
    } catch (error) {
      if (error.message === 'Email already exists' || error.message === 'Username already exists') {
        return res.status(400).json({ success: false, message: error.message })
      }
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new CreateAccountController()