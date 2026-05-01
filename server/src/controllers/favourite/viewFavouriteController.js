import ViewFavouriteService from '../../services/favourite/viewFavouriteService.js'

class ViewFavouriteController {
  async viewFavourite(req, res) {
    try {
      const favourite = await ViewFavouriteService.viewFavourite(req.params.id, req.userAccount._id.toString())
      res.status(200).json({ success: true, data: favourite })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}
export default new ViewFavouriteController()