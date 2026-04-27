import FundraisingActivityService from '../services/fundraisingActivityService.js'
import mongoose from 'mongoose'

class FundraisingActivityController {
  async createFRA(req, res) {
    try {
      const fra = await FundraisingActivityService.createFRA(req.body, req.user._id.toString())
      res.status(201).json({ success: true, message: 'Fundraising activity successfully created', data: fra })
    } catch (error) {
      res.status(400).json({ success: false, message: error.message })
    }
  }

  async getMyFRAs(req, res) {
    try {
      const fras = await FundraisingActivityService.getMyFRAs(req.user._id.toString())
      res.status(200).json({ success: true, data: fras })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async getFRAById(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ success: false, message: 'Fundraising activity not found' })
      const fra = await FundraisingActivityService.getFRAById(req.params.id, req.user._id.toString())
      res.status(200).json({ success: true, data: fra })
    } catch (error) {
      if (error.message === 'Unauthorized')
        return res.status(403).json({ success: false, message: error.message })
      if (error.message === 'Fundraising activity not found')
        return res.status(404).json({ success: false, message: error.message })
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async updateFRA(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ success: false, message: 'Fundraising activity not found' })
      const fra = await FundraisingActivityService.updateFRA(req.params.id, req.body, req.user._id.toString())
      res.status(200).json({ success: true, message: 'Fundraising activity successfully updated', data: fra })
    } catch (error) {
      if (error.message === 'Unauthorized')
        return res.status(403).json({ success: false, message: error.message })
      if (error.message === 'Fundraising activity not found')
        return res.status(404).json({ success: false, message: error.message })
      res.status(400).json({ success: false, message: error.message })
    }
  }

  async suspendFRA(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ success: false, message: 'Fundraising activity not found' })
      const fra = await FundraisingActivityService.suspendFRA(req.params.id, req.user._id.toString())
      res.status(200).json({ success: true, message: 'Fundraising activity successfully suspended', data: fra })
    } catch (error) {
      if (error.message === 'Unauthorized')
        return res.status(403).json({ success: false, message: error.message })
      if (error.message === 'Fundraising activity not found')
        return res.status(404).json({ success: false, message: error.message })
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async searchMyFRAs(req, res) {
    try {
      const { query } = req.query
      if (!query) return res.status(400).json({ success: false, message: 'Search query is required' })
      const fras = await FundraisingActivityService.searchMyFRAs(req.user._id.toString(), query)
      res.status(200).json({ success: true, data: fras })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async getCompletedFRAs(req, res) {
    try {
      const fras = await FundraisingActivityService.getCompletedFRAs(req.user._id.toString(), req.query)
      res.status(200).json({ success: true, data: fras })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async getAllActiveFRAs(req, res) {
    try {
      const fras = await FundraisingActivityService.getAllActiveFRAs()
      res.status(200).json({ success: true, data: fras })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async completeFRA(req, res) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ success: false, message: 'Fundraising activity not found' })
        const fra = await FundraisingActivityService.completeFRA(req.params.id, req.user._id.toString())
        res.status(200).json({ success: true, message: 'Fundraising activity successfully completed', data: fra })
    } catch (error) {
        if (error.message === 'Unauthorized')
        return res.status(403).json({ success: false, message: error.message })
        if (error.message === 'Fundraising activity not found')
        return res.status(404).json({ success: false, message: error.message })
        if (error.message === 'Campaign is already completed')
        return res.status(400).json({ success: false, message: error.message })
        res.status(500).json({ success: false, message: error.message })
    }
  }

  async searchAllFRAs(req, res) {
    try {
      const { query } = req.query
      if (!query) return res.status(400).json({ success: false, message: 'Search query is required' })
      const fras = await FundraisingActivityService.searchAllFRAs(query)
      res.status(200).json({ success: true, data: fras })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async shortlistFRA(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ success: false, message: 'Fundraising activity not found' })
      const fra = await FundraisingActivityService.shortlistFRA(req.params.id)
      res.status(200).json({ success: true, message: 'Campaign shortlisted', data: fra })
    } catch (error) {
      if (error.message === 'Fundraising activity not found')
        return res.status(404).json({ success: false, message: error.message })
      if (error.message === 'Campaign is not active')
        return res.status(400).json({ success: false, message: error.message })
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async recordView(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({ success: false, message: 'Fundraising activity not found' })
      await FundraisingActivityService.recordView(req.params.id)
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

export default new FundraisingActivityController()