const helper = require('./src/helpers')
require('dotenv').config({ path: helper.fileExists('.env_secret') })  // get environment variables
const express = require('express')
const app = express()
const port = 3000

const routes = require('./src/routes/routes')


app.use(express.json())
app.use('/', routes)
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
