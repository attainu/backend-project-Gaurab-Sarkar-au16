const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router.get('/', userController.getAllUsers)
router.post('/', userController.createUser)

router.get('/:id', userController.getUser)
router.patch('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router