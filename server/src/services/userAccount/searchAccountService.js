import UserAccountRepository from '../../repositories/UserAccountRepository.js'

class SearchAccountService {
  async searchAccount(query) {
    if (!query || query.trim() === '') {
      return await UserAccountRepository.findAll()
    }
    return await UserAccountRepository.search(query)
  }
}

export default new SearchAccountService()