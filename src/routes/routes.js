const { registerController, userController } = require('../controllers')
const { authorization, jwt, RequestValidator } = require('../middlewares')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'src/uploads' })


// API Endpoints
router.post('/api/auth/register', RequestValidator.registerSchema, registerController.register)
router.post('/api/auth/login', registerController.login)
router.get('/auth/verify/:token', registerController.verify)

router.get('/api/profile', jwt, authorization('admin', 'participant'), userController.getProfile)
router.put('/api/profile', jwt, authorization('admin'), userController.updateProfile)
router.post('/api/profile/photo', jwt, upload.single('photo'), userController.photoUpload)
router.post('/api/profile/delete', jwt, authorization('creator', 'participant'), userController.deleteProfile)

router.post('/api/users', jwt, authorization('admin'), registerController.register)
router.get('/api/users', [jwt, authorization('admin')], userController.getUsers)
router.get('/api/users/:id', [jwt, authorization('admin')], userController.getUserById)
router.put('/api/users/:id', jwt, authorization('admin'), userController.updateUserById)


module.exports = router
