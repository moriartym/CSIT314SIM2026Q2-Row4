import SuspendAccountService from '../../services/userAccount/suspendAccountService.js'
import mongoose from 'mongoose'

class SuspendAccountController {
  async suspendAccount(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'User ID not found' })
      }
      const userAccount = await SuspendAccountService.suspendAccount(req.params.id)
      res.status(200).json({ success: true, message: 'User Account successfully suspended', data: userAccount })
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: 'User account was not found' })
      }
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new SuspendAccountController()