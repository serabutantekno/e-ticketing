const { registerController, userController, eventController, paymentController } = require('../controllers')
const { authorization, jwt, RequestValidator } = require('../middlewares')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const { validateRequest, validateRequestB } = require('../helpers')
const upload = multer({ dest: 'src/uploads' })


// API Endpoints
router.post('/api/auth/register', validateRequestB(RequestValidator.register()), registerController.register)
router.post('/api/auth/login', validateRequestB(RequestValidator.login()), registerController.login)
router.get('/auth/verify/:token', registerController.verify)

router.get('/api/profile', jwt, authorization('admin', 'creator', 'participant'), userController.getProfile)
router.put('/api/profile', jwt, authorization('admin'), userController.updateProfile)
router.post('/api/profile/photo', jwt, upload.single('photo'), userController.photoUpload)
router.post('/api/profile/delete', jwt, authorization('creator', 'participant'), userController.deleteProfile)

router.post('/api/users', jwt, authorization('admin'), registerController.register)
router.get('/api/users', [jwt, authorization('admin')], userController.getUsers)
router.get('/api/users/:id', [jwt, authorization('admin')], userController.getUserById)
router.put('/api/users/:id', jwt, authorization('admin'), userController.updateUserById)

router.get('/api/events', jwt, eventController.getEvents)
router.get('/api/events/payments', jwt, authorization('admin', 'creator', 'participant'), paymentController.getPayments)
router.get('/api/events/payments/:pid', jwt, authorization('admin'), paymentController.getPaymentByID)
router.post('/api/events', jwt, authorization('creator'), RequestValidator.createEvent, eventController.createEvent)
router.get('/api/events/:id', jwt, authorization('admin', 'creator', 'participant'), eventController.getEventById)
router.put('/api/events/:id', jwt, authorization('admin', 'creator'), eventController.updateEvent)
router.delete('/api/events/:id', jwt, authorization('admin', 'creator'), eventController.deleteEvent)
router.post('/api/events/:id/payment', jwt, authorization('admin'), paymentController.createPayment)
router.put('/api/events/:id/payment/:pid', jwt, authorization('admin'), paymentController.updatePaymentByID)
router.delete('/api/events/:id/payment/:pid', jwt, authorization('admin'), paymentController.deletePayment)

module.exports = router
