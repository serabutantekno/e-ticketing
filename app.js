require('dotenv').config()  // get environment variables
const express = require('express')
const app = express()
const port = 3000

const middlewares = require('./src/middlewares/middlewares')
const userController = require('./src/controllers/controllers')


app.use(express.json())


app.post('/api/auth/register', userController.register)
app.post('/api/auth/login', userController.login)
app.get('/api/users/:id', middlewares, userController.getUserById)


app.listen(port, () => {
  console.log('Running on port ' + port)
})
