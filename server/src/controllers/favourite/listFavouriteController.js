import ListFavouriteService from '../../services/favourite/listFavouriteService.js'

class ListFavouriteController {
  async listFavourite(req, res) {
    try {
      const limit  = req.query.limit || 5
      const skip   = req.query.skip  || 0
      const result = await ListFavouriteService.listFavourite(req.userAccount._id.toString(), limit, skip)
      res.status(200).json({ success: true, ...result })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ListFavouriteController()