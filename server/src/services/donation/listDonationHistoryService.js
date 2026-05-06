import DonationRepository from '../../repositories/DonationRepository.js'
import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class ListDonationHistoryService {
  async listDonationHistory(doneeId, filters = {}, limit = 5, skip = 0) {
    const { data, total } = await DonationRepository.findByDonee(doneeId, filters, limit, skip)
    const fras = data.map(d => d.fra).filter(Boolean)
    const withProgress = await FundraisingActivityRepository._attachProgress(fras)
    const progressMap = {}
    withProgress.forEach(f => { progressMap[f._id.toString()] = f.totalRaised })
    const result = data.map(d => {
      const plain = d.toObject ? d.toObject() : d
      if (plain.fra) plain.fra.totalRaised = progressMap[plain.fra._id.toString()] ?? 0
      return plain
    })
    return { data: result, total }
  }
}

export default new ListDonationHistoryService()