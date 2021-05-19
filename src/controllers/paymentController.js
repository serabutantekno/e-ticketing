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

  static async getPaymentByID(req, res, next) {
    try {
      const payment = await Payment.findOne({ where: { id: req.params.pid } })
      if (payment) {
        res.json(BaseResponse.success(payment, 'Payment has been made.'))
      }
      res.json(BaseResponse.success({}, 'Payment not found.', 'false'))
    } catch (error) {
      next(error)
    }
  }

  static async createPayment(req, res, next) {
    try {
      const currentPaymentStatus = await Payment.findOne({ where: { event_id: req.params.id, participant_id: req.body.participant_id } })
      if (currentPaymentStatus) {
        res.json(BaseResponse.success(currentPaymentStatus, `User with ID ${req.body.participant_id} already paid this event.`, 'false'))
      }

      const newPayment = await Payment.create(Object.assign(req.body, { event_id: req.params.id }))
      if (newPayment) {
        res.json(BaseResponse.success(newPayment, 'Payment created successfully.'))
      }
    } catch (error) {
      next(error)
    }
  }

  static async updatePaymentByID(req, res, next) {
    try {
      await Payment.update(req.body, { where: { id: req.params.pid } })
      res.json(BaseResponse.success(await Payment.findByPk(req.params.id), 'Payment updated successfully.'))
    } catch (error) {
      next(error)
    }
  }

  static async deletePayment(req, res, next) {
    try {
      const currentPaymentStatus = await Payment.destroy({ where: { event_id: req.params.id, participant_id: req.params.pid } })
      if (currentPaymentStatus) {
        res.json(BaseResponse.success({}, `Event with ID ${req.params.id} deleted successfully.`))
      }
      res.json(BaseResponse.success({}, `Event with ID ${req.params.id} already deleted.`, 'false'))
    } catch (error) {
      next(error)
    }
  }

}


module.exports = paymentController