require('dotenv').config()  // get environment variables
const express = require('express')
const app = express()
const port = 3000

const routes = require('./src/routes/routes')


app.use(express.json())
app.use('/', routes)


app.listen(port, () => {
  console.log('Running on port ' + port)
})
