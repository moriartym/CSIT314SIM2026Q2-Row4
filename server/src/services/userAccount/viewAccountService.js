import UserRepository from '../../repositories/UserAccountRepository.js'

class ViewAccountService {
  async viewAccount(id) {
    const userAccount = await UserRepository.findById(id)
    if (!userAccount) throw new Error('User not found')
    return userAccount
  }
}

export default new ViewAccountService()