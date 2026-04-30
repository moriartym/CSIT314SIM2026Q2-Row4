import UserRepository from '../../repositories/UserAccountRepository.js'

class SuspendAccountService {
  async suspendAccount(id) {
    const user = await UserRepository.toggleSuspend(id)
    if (!user) throw new Error('User not found')
    return user
  }
}

export default new SuspendAccountService()