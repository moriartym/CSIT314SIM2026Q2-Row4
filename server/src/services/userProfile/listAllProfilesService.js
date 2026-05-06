import UserProfileRepository from '../../repositories/UserProfileRepository.js'

class ListAllProfilesService {
  async listAll() {
    return await UserProfileRepository.findAll()
  }
}

export default new ListAllProfilesService()
