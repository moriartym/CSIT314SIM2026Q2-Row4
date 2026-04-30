import UpdateAccountService from '../../services/userAccount/updateAccountService.js'
import mongoose from 'mongoose'

class UpdateAccountController {
  async updateAccount(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'User ID not found' })
      }
      const user = await UpdateAccountService.updateAccount(req.params.id, req.body)
      res.status(200).json({ success: true, message: 'User Account successfully updated', data: user })
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: 'User account was not found' })
      }
      res.status(400).json({ success: false, message: error.message })
    }
  }
}

export default new UpdateAccountController()