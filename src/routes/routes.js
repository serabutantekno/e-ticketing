const { registerController, userController, eventController, paymentController } = require('../controllers')
const { authorization, jwt, RequestValidator } = require('../middlewares')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const { validateRequest } = require('../helpers')
const upload = multer({ dest: 'src/uploads' })


// API Endpoints
router.post('/auth/register', validateRequest(RequestValidator.register()), registerController.register)
router.post('/auth/login', validateRequest(RequestValidator.login()), registerController.login)
router.get('/auth/verify/:token', registerController.verify)

router.get('/profile', jwt, authorization('admin', 'creator', 'participant'), userController.getProfile)
router.put('/profile', jwt, authorization('admin'), userController.updateProfile)
router.post('/profile/photo', jwt, upload.single('photo'), userController.photoUpload)
router.post('/profile/delete', jwt, authorization('creator', 'participant'), userController.deleteProfile)

router.post('/users', jwt, authorization('admin'), registerController.register)
router.get('/users', [jwt, authorization('admin')], userController.getUsers)
router.get('/users/:id', [jwt, authorization('admin')], userController.getUserById)
router.put('/users/:id', jwt, authorization('admin'), userController.updateUserById)

router.get('/events', jwt, eventController.getEvents)
router.get('/events/payments', jwt, authorization('admin', 'creator', 'participant'), paymentController.getPayments)
router.get('/events/payments/:pid', jwt, authorization('admin'), paymentController.getPaymentByID)
router.post('/events', jwt, authorization('admin', 'creator'), validateRequest(RequestValidator.createEvent()), eventController.createEvent)
router.get('/events/:id', jwt, authorization('admin', 'creator', 'participant'), eventController.getEventById)
router.put('/events/:id', jwt, authorization('admin', 'creator'), validateRequest(RequestValidator.updateEvent()), eventController.updateEvent)
router.delete('/events/:id', jwt, authorization('admin', 'creator'), eventController.deleteEvent)
router.post('/events/:id/payment', jwt, authorization('admin'), paymentController.createPayment)
router.put('/events/:id/payment/:pid', jwt, authorization('admin'), paymentController.updatePaymentByID)
router.delete('/events/:id/payment/:pid', jwt, authorization('admin'), paymentController.deletePayment)

module.exports = router
