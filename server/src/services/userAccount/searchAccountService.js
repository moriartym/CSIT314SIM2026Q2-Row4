import UserAccountRepository from '../../repositories/UserAccountRepository.js'

class SearchAccountService {
  async searchAccount(query) {
    if (!query || query.trim() === '') return []
    return await UserAccountRepository.search(query)
  }
}

export default new SearchAccountService()