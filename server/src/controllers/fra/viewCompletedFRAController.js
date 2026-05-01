import ViewCompletedFRAService from '../../services/fra/viewCompletedFRAService.js'

class ViewCompletedFRAController {
  async viewCompletedFRA(req, res) {
    try {
      const fras = await ViewCompletedFRAService.viewCompletedFRA(req.userAccount._id.toString(), req.query)
      res.status(200).json({ success: true, data: fras })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ViewCompletedFRAController()