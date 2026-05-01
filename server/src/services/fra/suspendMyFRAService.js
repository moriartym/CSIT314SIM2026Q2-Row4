import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class SuspendMyFRAService {
  async suspendFRA(id, userId) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    if (fra.createdBy._id.toString() !== userId) throw new Error('Unauthorized')
    return await FundraisingActivityRepository.toggleSuspend(id)
  }
}

export default new SuspendMyFRAService()