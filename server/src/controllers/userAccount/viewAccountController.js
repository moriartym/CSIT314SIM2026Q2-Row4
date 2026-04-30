import ViewAccountService from '../../services/userAccount/viewAccountService.js'
import mongoose from 'mongoose'

class ViewAccountController {
  async viewAccount(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'User ID not found' })
      }
      const user = await ViewAccountService.viewAccount(req.params.id)
      res.status(200).json({ success: true, data: user })
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: 'User ID not found' })
      }
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ViewAccountController()