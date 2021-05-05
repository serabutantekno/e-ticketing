const { Sequelize } = require('sequelize')
const dotenv = require('dotenv').config()  // get config variables
const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
const port = 3000

const middlewares = require('./src/middlewares/middlewares')
const userController = require('./src/controllers/controllers')


app.use(express.json())


function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '60s' });
}


app.post('/api/auth/register', userController.register)
app.post('/api/auth/login', userController.login)
app.get('/api/users/:id', middlewares, userController.getUserById)


app.post('/api/createNewUser', (req, res) => {
  // ...

  console.log(req.body)

  const token = generateAccessToken({ username: req.body.username });
  res.json(token)

  // ...
});


app.get('/api/whatever', middlewares, (req, res) => {
  const token = req.header('eticketing-jwt')

  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (error) {
      res.status(500).send({
        auth: false,
        message: 'Gagal autentikasi token.'
      })
    } else {
      res.status(200).send(decoded)
    }
  })

  res.sendStatus(200)
})


app.listen(port, () => {
  console.log('Running on port ' + port)
})


// Testing Database connection
const db = require('./src/config/database.json')
const sequelize = new Sequelize(db.development)


try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
