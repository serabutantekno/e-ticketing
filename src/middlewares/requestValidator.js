const Joi = require('joi')
const validateRequest = require('../helpers/requestValidator')


class RequestValidator {

  static registerSchema(req, res, next) {
    const schema = Joi.object({
      username: Joi.string().required(),
      fullname: Joi.string(),
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required(),
      role: Joi.string().valid('admin', 'creator', 'user').required()
    })
    validateRequest(req, next, schema)
  }

}


module.exports = RequestValidator
