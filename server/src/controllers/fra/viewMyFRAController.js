import ViewMyFRAService from '../../services/fra/viewMyFRAService.js'

class ViewMyFRAController {
  async viewMyFRA(req, res) {
    try {
      const fras = await ViewMyFRAService.viewMyFRA(req.userAccount._id.toString())
      res.status(200).json({ success: true, data: fras })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ViewMyFRAController()