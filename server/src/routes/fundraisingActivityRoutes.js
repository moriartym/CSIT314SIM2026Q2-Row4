import express from 'express'
import CreateMyFRAController from '../controllers/fra/createMyFRAController.js'
import ViewMyFRAController from '../controllers/fra/viewMyFRAController.js'
import ViewFRAController from '../controllers/fra/viewFRAController.js'
import ViewMyCompletedFRAController from '../controllers/fra/viewMyCompletedFRAController.js'
import UpdateMyFRAController from '../controllers/fra/updateMyFRAController.js'
import SuspendMyFRAController from '../controllers/fra/suspendMyFRAController.js'
import MarkCompleteFRAController from '../controllers/fra/markCompleteFRAController.js'
import SearchFRAController from '../controllers/fra/searchFRAController.js'
import SearchAllFRAController from '../controllers/fra/searchAllFRAController.js'
import ViewFRAViewCountController from '../controllers/fra/viewFRAViewCountController.js'
import SearchDonationHistoryController from '../controllers/donation/searchDonationHistoryController.js'
import CreateDonationController from '../controllers/donation/createDonationController.js'
import { requireAuth, requirePermission } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', requireAuth, requirePermission('fundraising'), (req, res) => CreateMyFRAController.createFRA(req, res))
router.get('/mine', requireAuth, requirePermission('fundraising'), (req, res) => ViewMyFRAController.viewMyFRA(req, res))
router.get('/search', requireAuth, requirePermission('fundraising'), (req, res) => SearchFRAController.searchFRA(req, res))
router.get('/completed', requireAuth, requirePermission('fundraising'), (req, res) => ViewMyCompletedFRAController.viewCompletedFRA(req, res))
router.get('/all/search', requireAuth, requirePermission('donating', 'fundraising'), (req, res) => SearchAllFRAController.searchAllFRA(req, res))
router.post('/donations', requireAuth, requirePermission('donating'), (req, res) => CreateDonationController.createDonation(req, res))
router.get('/donations', requireAuth, requirePermission('donating'), (req, res) => SearchDonationHistoryController.searchDonationHistory(req, res))
router.patch('/:id/complete', requireAuth, requirePermission('fundraising'), (req, res) => MarkCompleteFRAController.completeFRA(req, res))
router.post('/:id/view', requireAuth, requirePermission('donating', 'fundraising'), (req, res) => ViewFRAViewCountController.viewFRAViewCount(req, res))
router.get('/:id', requireAuth, requirePermission('fundraising', 'donating'), (req, res) => ViewFRAController.viewFRA(req, res))
router.put('/:id', requireAuth, requirePermission('fundraising'), (req, res) => UpdateMyFRAController.updateFRA(req, res))
router.patch('/:id/suspend', requireAuth, requirePermission('fundraising'), (req, res) => SuspendMyFRAController.suspendFRA(req, res))

export default router