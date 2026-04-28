import express from 'express'
import FundraisingActivityController from '../controllers/fundraisingActivityController.js'
import { requireAuth, requirePermission } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', requireAuth, requirePermission('fundraising'), FundraisingActivityController.createFRA.bind(FundraisingActivityController))
router.get('/mine', requireAuth, requirePermission('fundraising'), FundraisingActivityController.getMyFRAs.bind(FundraisingActivityController))
router.get('/search', requireAuth, requirePermission('fundraising'), FundraisingActivityController.searchMyFRAs.bind(FundraisingActivityController))
router.get('/completed', requireAuth, requirePermission('fundraising'), FundraisingActivityController.getCompletedFRAs.bind(FundraisingActivityController))
router.get('/all', requireAuth, requirePermission('donating'),    FundraisingActivityController.getAllActiveFRAs.bind(FundraisingActivityController))
router.get('/all/search', requireAuth, requirePermission('donating'),    FundraisingActivityController.searchAllFRAs.bind(FundraisingActivityController))
router.patch('/:id/complete', requireAuth, requirePermission('fundraising'), FundraisingActivityController.completeFRA.bind(FundraisingActivityController))
router.post('/:id/view', requireAuth, requirePermission('donating'), FundraisingActivityController.recordView.bind(FundraisingActivityController))
router.get('/:id',              requireAuth, requirePermission('fundraising'), FundraisingActivityController.getFRAById.bind(FundraisingActivityController))
router.put('/:id', requireAuth, requirePermission('fundraising'), FundraisingActivityController.updateFRA.bind(FundraisingActivityController))
router.patch('/:id/suspend', requireAuth, requirePermission('fundraising'), FundraisingActivityController.suspendFRA.bind(FundraisingActivityController))
router.post('/:id/shortlist',requireAuth, requirePermission('donating'),    FundraisingActivityController.shortlistFRA.bind(FundraisingActivityController))
export default router