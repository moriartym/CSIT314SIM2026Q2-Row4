import CreateFRAService from '../../services/fra/createFRAService.js'

class CreateFRAController {
  async createFRA(req, res) {
    try {
      const fra = await CreateFRAService.createFRA(req.body, req.user._id.toString())
      res.status(201).json({ success: true, message: 'Fundraising activity successfully created', data: fra })
    } catch (error) {
      res.status(400).json({ success: false, message: error.message })
    }
  }
}

export default new CreateFRAController()