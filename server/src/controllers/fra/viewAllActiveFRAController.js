import ViewAllActiveFRAService from '../../services/fra/viewAllActiveFRAService.js'

class ViewAllActiveFRAController {
  async viewAllActiveFRA(req, res) {
    try {
      const fras = await ViewAllActiveFRAService.viewAllActiveFRA()
      res.status(200).json({ success: true, data: fras })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ViewAllActiveFRAController()