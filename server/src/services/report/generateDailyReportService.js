import FundraisingActivityRepository from '../../repositories/FundraisingActivityRepository.js'

class GenerateDailyReportService {
  async generateDailyReport() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    return await FundraisingActivityRepository.findByDateRange(today, yesterday)
  }
}

export default new GenerateDailyReportService()