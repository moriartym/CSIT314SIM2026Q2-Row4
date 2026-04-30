import express from 'express'
import CreateAccountController from '../controllers/userAccount/createAccountController.js'
import ViewAccountController from '../controllers/userAccount/viewAccountController.js'
import UpdateAccountController from '../controllers/userAccount/updateAccountController.js'
import SuspendAccountController from '../controllers/userAccount/suspendAccountController.js'
import SearchAccountController from '../controllers/userAccount/searchAccountController.js'
import { requireAuth, requirePermission } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', requireAuth, requirePermission('user_management'), (req, res) => CreateAccountController.createAccount(req, res))
router.get('/search', requireAuth, requirePermission('user_management'), (req, res) => SearchAccountController.searchAccount(req, res))
router.get('/:id', requireAuth, requirePermission('user_management'), (req, res) => ViewAccountController.viewAccount(req, res))
router.put('/:id', requireAuth, requirePermission('user_management'), (req, res) => UpdateAccountController.updateAccount(req, res))
router.patch('/:id/suspend', requireAuth, requirePermission('user_management'), (req, res) => SuspendAccountController.suspendAccount(req, res))

export default router