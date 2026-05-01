import SearchAccountService from '../../services/userAccount/searchAccountService.js'

class SearchAccountController {
  async searchAccount(req, res) {
    try {
      const { query } = req.query
      const userAccounts = await SearchAccountService.searchAccount(query)
      res.status(200).json({ success: true, data: userAccounts })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new SearchAccountController()