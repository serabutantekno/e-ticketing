const helper = require('./src/helpers')
require('dotenv').config({ path: helper.fileExists('.env_secret') })  // get environment variables
const express = require('express')
const app = express()
const db = require('./src/db/models')
const cors = require('cors')
const cron = require('node-cron')
const Queue = require('bull')
const sendMail = require('./src/controllers/sendMailController')
const sendInstructionPaymentMail = new Queue('sendInstructionPaymentMail')
sendInstructionPaymentMail.process(2, (job, done) => {
  sendMail(job.data.email, 'emailPaymentInstruction24H').then(res => done(null, res))
})
const port = 3000

const routes = require('./src/routes/routes')


var corsOptions = {
  origin: ['https://developer.mozilla.org', 'https://www.google.com'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/v1/', routes)
app.use((req, res, next) => {
  res.status(404).json({ message: 'not found' })
})
app.use((err, req, res, next) => {
  res.status(404).json({
    message: err.message,
    stack_error: err
  })
})


cron.schedule('0 12 * * *', async () => {
  /** Promotional Mails */
  const query = `SELECT e.id, u.username, u.email, p.payment_status, e.event_start_date, e.event_end_date
  FROM Payments p
  JOIN Users u ON p.participant_id = u.id
  JOIN Events e ON p.event_id = e.id
  WHERE DATE_SUB(CURDATE(), INTERVAL 1 DAY) <= e.event_start_date AND p.payment_status != 'passed'`
  const [result, metadata] = await db.sequelize.query(query)
  sendInstructionPaymentMail.add({email: result[0].email})
})


app.listen(port, () => {
  console.log('Running on port ' + port)
})
