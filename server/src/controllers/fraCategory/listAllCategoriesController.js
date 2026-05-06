import ListAllCategoriesService from '../../services/fraCategory/listAllCategoriesService.js'

class ListAllCategoriesController {
  async listAll(req, res) {
    try {
      const categories = await ListAllCategoriesService.listAll()
      res.status(200).json({ success: true, data: categories })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new ListAllCategoriesController()
