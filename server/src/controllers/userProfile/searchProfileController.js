import SearchProfileService from '../../services/userProfile/searchProfileService.js'

class SearchProfileController {
  async searchProfile(req, res) {
    try {
      const { query } = req.query
      const userProfiles = await SearchProfileService.searchProfile(query)
      res.status(200).json({ success: true, data: userProfiles })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new SearchProfileController()