const Joi = require('joi')
const validateRequest = require('../helpers/requestValidator')


class RequestValidator {

  /** Auth */
  static register(req, res, next) {
    return Joi.object({
        username: Joi.string().required(),
        fullname: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
        role: Joi.string().valid('admin', 'creator', 'participant').required()
    })
    // validateRequest(req, next, schema)
  }

  static login() {
    return Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    })
    // validateRequest(req, next, schema)
  }


  /** Event */
  static createEvent(req, res, next) {
    const schema = Joi.object({
      title_event: Joi.string().required(),
      link_webinar: Joi.string().required(),
      description: Joi.string().required(),
      banner: Joi.string(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      status: Joi.valid('draft', 'release').required(),
      event_start_date: Joi.date(),
      event_end_date: Joi.date()
    })
    validateRequest(req, next, schema)
  }

}


module.exports = RequestValidator
