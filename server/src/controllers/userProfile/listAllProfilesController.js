import ListAllProfilesService from '../../services/userProfile/listAllProfilesService.js'

class ListAllProfilesController {
  async listAll(req, res) {
    try {
      const profiles = await ListAllProfilesService.listAll()
      res.status(200).json({ success: true, data: profiles })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ListAllProfilesController()
