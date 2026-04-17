import express from 'express'
import UserController from '../controllers/userController.js'
import { requireAuth, requirePermission } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', requireAuth, requirePermission('user_management'), UserController.createUser.bind(UserController))
router.get('/', requireAuth, requirePermission('user_management'), UserController.getAllUsers.bind(UserController))
router.get('/search', requireAuth, requirePermission('user_management'), UserController.searchUsers.bind(UserController))
router.get('/:id', requireAuth, requirePermission('user_management'), UserController.getUserById.bind(UserController))
router.put('/:id', requireAuth, requirePermission('user_management'), UserController.updateUser.bind(UserController))
router.patch('/:id/suspend', requireAuth, requirePermission('user_management'), UserController.suspendUser.bind(UserController))

export default router