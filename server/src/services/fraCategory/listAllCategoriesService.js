import FRACategoryRepository from '../../repositories/FRACategoryRepository.js'

class ListAllCategoriesService {
  async listAll() {
    return await FRACategoryRepository.findAll()
  }
}

export default new ListAllCategoriesService()
