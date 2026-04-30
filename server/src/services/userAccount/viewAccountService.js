import UserRepository from '../../repositories/UserAccountRepository.js'

class ViewAccountService {
  async viewAccount(id) {
    const user = await UserRepository.findById(id)
    if (!user) throw new Error('User not found')
    return user
  }
}

export default new ViewAccountService()