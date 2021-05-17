const TemplateData = require('./templateData')
const registerController = require('./registerController')
const userController = require('./userController')

const eventController = require('./eventController')
const paymentController = require('./paymentController')


module.exports = {
  TemplateData,
  registerController,
  userController,

  eventController,
  paymentController
}
