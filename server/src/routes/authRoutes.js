import express from 'express'
import LoginController from '../controllers/auth/loginController.js'
import LogoutController from '../controllers/auth/logoutController.js'
import { requireAuth, requirePermission, me } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/login', (req, res) => LoginController.login(req, res))
router.post('/logout', (req, res) => LogoutController.logout(req, res))
router.get('/me', me)

export default router