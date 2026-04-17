import express from 'express'
import UserProfileController from '../controllers/userProfileController.js'
import { requireAuth, requirePermission } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', requireAuth, requirePermission('user_management'), UserProfileController.createUserProfile.bind(UserProfileController))
router.get('/', requireAuth, requirePermission('user_management'), UserProfileController.getAllUserProfiles.bind(UserProfileController))
router.get('/search', requireAuth, requirePermission('user_management'), UserProfileController.searchUserProfiles.bind(UserProfileController))
router.get('/:id', requireAuth, requirePermission('user_management'), UserProfileController.getUserProfileById.bind(UserProfileController))
router.put('/:id', requireAuth, requirePermission('user_management'), UserProfileController.updateUserProfile.bind(UserProfileController))
router.patch('/:id/suspend', requireAuth, requirePermission('user_management'), UserProfileController.suspendUserProfile.bind(UserProfileController))

export default router