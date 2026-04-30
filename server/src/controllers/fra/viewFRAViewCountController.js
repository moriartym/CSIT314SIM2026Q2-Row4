import ViewFRAViewCountService from '../../services/fra/viewFRAViewCountService.js'
import mongoose from 'mongoose'

class ViewFRAViewCountController {
  async viewFRAViewCount(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ success: false, message: 'Fundraising activity not found' })
      await ViewFRAViewCountService.viewFRAViewCount(req.params.id)
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ViewFRAViewCountController()