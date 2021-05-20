const helper = require('./src/helpers')
require('dotenv').config({ path: helper.fileExists('.env_secret') })  // get environment variables
const express = require('express')
const app = express()
const cors = require('cors')
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


app.listen(port, () => {
  console.log('Running on port ' + port)
})
