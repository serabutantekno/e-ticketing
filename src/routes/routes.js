const path = require('path')
const { registerController, userController, eventController, paymentController } = require('../controllers')
const { authorization, jwt, RequestValidator } = require('../middlewares')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const { validateRequest } = require('../helpers')
// const upload = multer({ dest: 'src/uploads' })
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname)
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported."), false)
      return
    }
    cb(null, true)
  }
})
const sendMail = require('../controllers/sendMailController')
const Queue = require('bull')
const { createBullBoard } = require('bull-board')
const { BullAdapter } = require('bull-board/bullAdapter')


const testQueue = new Queue('antrian')
testQueue.process(4, (job, done) => {
  console.log(job)
  sendMail(job.data.email, 'emailPaymentInstruction').then(res => done(null, res))
  // done()
})

const { router:bullrouter, setQueues, replaceQueues } = createBullBoard([
  new BullAdapter(testQueue)
])

router.use('/bullboard', bullrouter)

// API Endpoints
router.post('/auth/register', validateRequest(RequestValidator.register()), registerController.register)
router.post('/auth/login', validateRequest(RequestValidator.login()), registerController.login)
router.get('/auth/verify/:token', registerController.verify)

router.post('/su/verify/user', jwt, authorization('superuser'), registerController.verifyBySuperuser)

router.post('/admin/verify/user', jwt, authorization('admin'), registerController.resendEmailVerification)

router.get('/profile', jwt, authorization('admin', 'creator', 'participant'), userController.getProfile)
router.put('/profile', jwt, authorization('admin'), userController.updateProfile)
router.post('/profile/photo', jwt, upload.single('photo'), userController.photoUpload)
router.post('/profile/delete', jwt, authorization('creator', 'participant'), userController.deleteProfile)

router.post('/users', jwt, authorization('admin'), registerController.register)
router.get('/users', [jwt, authorization('admin')], userController.getUsers)
router.get('/users/:id', [jwt, authorization('admin')], userController.getUserById)
router.put('/users/:id', jwt, authorization('admin'), userController.updateUserById)

router.get('/events', jwt, eventController.getEvents)
router.get('/events/done', jwt, authorization('creator'), eventController.getCreatorDoneEvents)
router.get('/events/payments', jwt, authorization('admin', 'creator', 'participant'), paymentController.getPayments)
router.get('/events/payments/:pid', jwt, authorization('admin'), paymentController.getPaymentByID)
router.post('/admin/payments/:pid', jwt, authorization('admin'), paymentController.verifyPayment)
router.post('/events', jwt, authorization('admin', 'creator'), validateRequest(RequestValidator.createEvent()), eventController.createEvent)
router.get('/events/:id', jwt, authorization('admin', 'creator', 'participant'), eventController.getEventById)
router.put('/events/:id', jwt, authorization('admin', 'creator'), validateRequest(RequestValidator.updateEvent()), eventController.updateEvent)
router.delete('/events/:id', jwt, authorization('admin', 'creator'), eventController.deleteEvent)
router.post('/events/:id/payment', jwt, authorization('participant'), paymentController.createPaymentByParticipant)
router.post('/events/:id/payment/proof', jwt, authorization('participant'), upload.single('proof'), paymentController.paymentProof)
// router.put('/events/:id/payment/:pid', jwt, authorization('admin'), paymentController.updatePaymentByID) ===> seharusnya fitur ini tidak dibutuhkan
router.delete('/events/:id/payment/:pid', jwt, authorization('admin'), paymentController.deletePayment)




router.get('/bull', (req, res) => {
  for (let i=1; i<=10; i++) {
    testQueue.add({'email': 'mail@domain.com'})
  }

  res.json({'status': 'oke'})
})

router.get('/coba', (req, res) => {
  res.json({
    'status': 'ok'
  })
})


module.exports = router
