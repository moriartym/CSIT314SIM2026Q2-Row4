import express from 'express'
import authController from '../controllers/authController.js'

const router = express.Router()

router.post('/login', (req, res) => authController.login(req, res))
router.post('/logout', (req, res) => authController.logout(req, res))
router.get('/me', (req, res) => authController.me(req, res))

export default router