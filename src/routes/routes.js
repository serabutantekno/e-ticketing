const { registerController, userController } = require('../controllers')
const { afterMiddleware, authorization, jwt } = require('../middlewares')
const express = require('express')
const router = express.Router()


// API Endpoints
router.post('/api/auth/register', registerController.register)
router.post('/api/auth/login', registerController.login)

router.get('/api/users', [jwt, authorization('admin')], userController.getUsers)
router.get('/api/users/:id', [jwt, authorization('admin')], userController.getUserById, afterMiddleware)


module.exports = router
