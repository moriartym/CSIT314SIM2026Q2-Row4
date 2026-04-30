import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class ViewFRAViewCountService {
  async viewFRAViewCount(id) {
    const fra = await FundraisingActivityRepository.findById(id)
    if (!fra) throw new Error('Fundraising activity not found')
    return await FundraisingActivityRepository.incrementViewCount(id)
  }
}

export default new ViewFRAViewCountService()