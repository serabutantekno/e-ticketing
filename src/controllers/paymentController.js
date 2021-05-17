const { Payment } = require('../db/models')
const { BaseResponse } = require('../helpers')


class paymentController {

  static async getPayments(req, res, next) {
    try {
      res.json(BaseResponse.success(await Payment.findAll(), 'Payments retrieved successfully.'))
    } catch (error) {
      next(error)
    }
  }

}


module.exports = paymentController
