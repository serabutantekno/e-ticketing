const Joi = require('joi')


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
  }

  static login() {
    return Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    })
  }


  /** Event */
  static createEvent(req, res, next) {
    return Joi.object({
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
  }

  static updateEvent(req, res, next) {
    return Joi.object({
      creator_id: Joi.number().required()
    })
  }

}


module.exports = RequestValidator
