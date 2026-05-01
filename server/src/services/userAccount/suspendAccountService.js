import UserRepository from '../../repositories/UserAccountRepository.js'

class SuspendAccountService {
  async suspendAccount(id) {
    const userAccount = await UserRepository.toggleSuspend(id)
    if (!userAccount) throw new Error('User not found')
    return userAccount
  }
}

export default new SuspendAccountService()