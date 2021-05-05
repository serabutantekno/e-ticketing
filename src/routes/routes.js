const userController = require('../controllers/controllers')
const { authorization, jwt } = require('../middlewares')
const express = require('express')
const router = express.Router()


// API Endpoints
router.post('/api/auth/register', userController.register)
router.post('/api/auth/login', userController.login)
router.get('/api/users/:id', [jwt, authorization('admin')], userController.getUserById)


module.exports = router
