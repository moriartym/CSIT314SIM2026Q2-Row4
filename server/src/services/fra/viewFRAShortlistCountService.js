import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class ViewFRAShortlistCountService {
  async viewFRAShortlistCount(id) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    if (fra.status !== 'active') throw new Error('Campaign is not active')
    return await FundraisingActivityRepository.incrementShortlistCount(id)
  }
}

export default new ViewFRAShortlistCountService()