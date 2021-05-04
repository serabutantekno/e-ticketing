const { Sequelize } = require('sequelize')
const express = require('express')
const app = express()
const port = 3000


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
