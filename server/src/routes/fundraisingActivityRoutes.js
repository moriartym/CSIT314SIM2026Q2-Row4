import express from 'express'
import CreateFRAController from '../controllers/fra/createFRAController.js'
import ViewFRAController from '../controllers/fra/viewFRAController.js'
import ViewMyCompletedFRAController from '../controllers/fra/viewMyCompletedFRAController.js'
import UpdateFRAController from '../controllers/fra/updateFRAController.js'
import SuspendFRAController from '../controllers/fra/suspendFRAController.js'
import MarkCompleteFRAController from '../controllers/fra/markCompleteFRAController.js'
import SearchFRAController from '../controllers/fra/searchFRAController.js'
import SearchAllFRAController from '../controllers/fra/searchAllFRAController.js'
import ViewFRAViewCountController from '../controllers/fra/viewFRAViewCountController.js'
import SearchDonationHistoryController from '../controllers/donation/searchDonationHistoryController.js'
import CreateDonationController from '../controllers/donation/createDonationController.js'
import { requireAuth, requirePermission } from '../middleware/authMiddleware.js'

const router = express.Router()
router.post('/', requireAuth, requirePermission('fundraising'), (req, res) => CreateFRAController.createFRA(req, res))
router.get('/search', requireAuth, requirePermission('fundraising'), (req, res) => SearchFRAController.searchFRA(req, res))
router.get('/completed', requireAuth, requirePermission('fundraising'), (req, res) => ViewMyCompletedFRAController.viewCompletedFRA(req, res))
router.get('/all/search', requireAuth, requirePermission('donating', 'fundraising'), (req, res) => SearchAllFRAController.searchAllFRA(req, res))
router.post('/donations', requireAuth, requirePermission('donating'), (req, res) => CreateDonationController.createDonation(req, res))
router.get('/donations/search', requireAuth, requirePermission('donating'), (req, res) => SearchDonationHistoryController.searchDonationHistory(req, res))
router.patch('/:id/complete', requireAuth, requirePermission('fundraising'), (req, res) => MarkCompleteFRAController.completeFRA(req, res))
router.post('/:id/view', requireAuth, requirePermission('donating', 'fundraising'), (req, res) => ViewFRAViewCountController.viewFRAViewCount(req, res))
router.get('/:id', requireAuth, requirePermission('fundraising', 'donating'), (req, res) => ViewFRAController.viewFRA(req, res))
router.put('/:id', requireAuth, requirePermission('fundraising'), (req, res) => UpdateFRAController.updateFRA(req, res))
router.patch('/:id/suspend', requireAuth, requirePermission('fundraising'), (req, res) => SuspendFRAController.suspendFRA(req, res))

export default router