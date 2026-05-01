import ViewMyCompletedFRAService from '../../services/fra/viewMyCompletedFRAService.js'

class ViewMyCompletedFRAController {
  async viewCompletedFRA(req, res) {
    try {
      const fras = await ViewMyCompletedFRAService.viewCompletedFRA(req.userAccount._id.toString(), req.query)
      res.status(200).json({ success: true, data: fras })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ViewMyCompletedFRAController()