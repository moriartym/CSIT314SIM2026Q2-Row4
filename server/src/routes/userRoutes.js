import express from 'express'
import UserController from '../controllers/userController.js'

const router = express.Router()

router.post('/', UserController.createUser.bind(UserController))
router.get('/', UserController.getAllUsers.bind(UserController))
router.get('/:id', UserController.getUserById.bind(UserController))
router.put('/:id', UserController.updateUser.bind(UserController))

export default router