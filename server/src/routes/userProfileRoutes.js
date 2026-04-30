import express from 'express'
import CreateProfileController from '../controllers/userProfile/createProfileController.js'
import ViewProfileController from '../controllers/userProfile/viewProfileController.js'
import UpdateProfileController from '../controllers/userProfile/updateProfileController.js'
import SuspendProfileController from '../controllers/userProfile/suspendProfileController.js'
import SearchProfileController from '../controllers/userProfile/searchProfileController.js'
import { requireAuth, requirePermission } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', requireAuth, requirePermission('user_management'), (req, res) => CreateProfileController.createProfile(req, res))
router.get('/search', requireAuth, requirePermission('user_management'), (req, res) => SearchProfileController.searchProfile(req, res))
router.get('/:id', requireAuth, requirePermission('user_management'), (req, res) => ViewProfileController.viewProfile(req, res))
router.put('/:id', requireAuth, requirePermission('user_management'), (req, res) => UpdateProfileController.updateProfile(req, res))
router.patch('/:id/suspend', requireAuth, requirePermission('user_management'), (req, res) => SuspendProfileController.suspendProfile(req, res))

export default router