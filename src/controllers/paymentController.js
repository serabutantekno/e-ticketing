const cloudinary = require('cloudinary').v2
const { Event, Payment, User } = require("../db/models");
const { BaseResponse } = require("../helpers");
const TemplateData = require('./templateData')
const sendMail = require("./sendMailController");

class paymentController {

  static async paymentProof(req, res, next) {
    try {
      const upload = await cloudinary.uploader.upload(req.file.path)
      console.log(upload)
      console.log(req.user)
      const currentPayment = await Payment.findOne({
        where: {
          event_id: req.params.id,
          participant_id: req.user.id
        }
      })
      if (currentPayment.payment_slip) {
        const [public_id] = Buffer.from(currentPayment.payment_slip, 'base64').toString('utf8').split('|')
        await cloudinary.uploader.destroy(public_id)
      }
      const base64data_encode = Buffer.from((upload.public_id + '|' + upload.secure_url), 'utf8').toString('base64')
      const update = await currentPayment.update({ payment_slip: base64data_encode })
      if(update) {
        const payment = await Payment.findOne({
          where: {
            event_id: req.params.id,
            participant_id: req.user.id
          },
          include: {
            model: User,
            as: 'participant',
            attributes: ['username', 'fullname', 'email']
          }
          // attributes: ['fullname']
        })
        res.status(200).json(BaseResponse.success(payment, 'Payment slip uploaded.'))
      }
    } catch (error) {
      next(error)
    }
  }

  static async verifyPayment(req, res, next) {
    try {
      const payment_status = ['pending', 'passed', 'failed']
      if (!payment_status.includes(req.body.payment_status)) {
        res.status(400).json(BaseResponse.success({}, 'Invalid payment status.', 'failed'))
      } else {
        await Payment.update({
          'payment_status': req.body.payment_status
        },
        {
          where: {
            id: req.params.pid
          }
        })
        let emailType
        if (req.body.payment_status === 'pending') {
          emailType = 'emailPaymentPending'
        } else if (req.body.payment_status === 'failed') {
          emailType = 'emailPaymentFailed'
        } else if (req.body.payment_status === 'passed') {
          emailType = 'emailPaymentPassed'
        }
        const currentPayment = await Payment.findOne({
          where: {
            id: req.params.pid
          },
          include: {
            model: User,
            as: 'participant',
            attributes: ['username', 'fullname', 'email']
          }
        })
        sendMail(currentPayment.participant.email, emailType)
        res.status(200).json(BaseResponse.success(currentPayment, `Payment status changed to ${currentPayment.payment_status}.`))
      }
    } catch (error) {
      next(error)
    }
  }

  static async getPayments(req, res, next) {
    try {
      let result;
      if (req.user.role === "creator") {
        return res.status(200).json(
          BaseResponse.success(
            await Payment.findAll({
              include: {
                model: Event,
                as: "event",
                where: {
                  creator_id: req.user.id,
                },
                attributes: [],
              },
            })
          )
        )
      } else if (req.user.role === "participant") {
        return res.status(200).json(
          BaseResponse.success(
            await Payment.findAll({
              where: {
                participant_id: req.user.id
              },
            })
          )
        )
      }

      /** If request from admin or superuser */
      res.json(
        BaseResponse.success(
          await Payment.findAll({}),
          "Payments retrieved successfully."
        )
      );
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentByID(req, res, next) {
    try {
      const payment = await Payment.findOne({ where: { id: req.params.pid } });
      if (payment) {
        res.json(BaseResponse.success(payment, "Payment has been made."));
      }
      res.json(BaseResponse.success({}, "Payment not found.", "false"));
    } catch (error) {
      next(error);
    }
  }

  static async createPaymentByAdmin(req, res, next) {
    try {
      const currentPaymentStatus = await Payment.findOne({
        where: {
          event_id: req.params.id,
          participant_id: req.body.participant_id,
        },
      });
      if (currentPaymentStatus) {
        return res.json(
          BaseResponse.success(
            currentPaymentStatus,
            `User with ID ${req.body.participant_id} already paid this event.`,
            "false"
          )
        );
      }

      const newPayment = await Payment.create(
        Object.assign(req.body, { event_id: req.params.id })
      );
      const getNewPayment = await Payment.findOne({
        where: {
          participant_id: req.body.participant_id,
        },
        include: [
          {
            model: User,
            required: true,
            as: "participant",
          },
        ],
      });
      if (newPayment) {
        res.json(
          BaseResponse.success(
            newPayment,
            "Payment created successfully. Please check your email to complete the payment."
          )
        );
        /** send instruction email to complete the payment */
        sendMail(getNewPayment.participant.email, "emailPaymentInstruction");
      }
    } catch (error) {
      next(error);
    }
  }

  static async createPaymentByParticipant(req, res, next) {
    try {
      const currentPaymentStatus = await Payment.findOne({
        where: { event_id: req.params.id, participant_id: req.user.id },
      });
      if (currentPaymentStatus) {
        return res.json(
          BaseResponse.success(
            currentPaymentStatus,
            `User with ID ${req.body.participant_id} already buy this ticket.`,
            "false"
          )
        );
      }
      console.log("user", req.user);
      const newPayment = await Payment.create(
        Object.assign(req.body, {
          event_id: req.params.id,
          participant_id: req.user.id,
        })
      );
      const getNewPayment = await Payment.findOne({
        where: {
          participant_id: req.user.id,
        },
        include: [
          {
            model: User,
            required: true,
            as: "participant",
          },
        ],
      });
      if (newPayment) {
        res.json(
          BaseResponse.success(
            newPayment,
            "Payment created successfully. Please check your email to complete the payment."
          )
        );
        /** send instruction email to complete the payment */
        sendMail(getNewPayment.participant.email, "emailPaymentInstruction");
      }
    } catch (error) {
      next(error);
    }
  }

  static async updatePaymentByID(req, res, next) {
    try {
      await Payment.update(req.body, { where: { id: req.params.pid } });
      res.json(
        BaseResponse.success(
          await Payment.findByPk(req.params.id),
          "Payment updated successfully."
        )
      );
    } catch (error) {
      next(error);
    }
  }

  static async deletePayment(req, res, next) {
    try {
      const currentPaymentStatus = await Payment.destroy({
        where: { event_id: req.params.id, participant_id: req.params.pid },
      });
      if (currentPaymentStatus) {
        res.json(
          BaseResponse.success(
            {},
            `Event with ID ${req.params.id} deleted successfully.`
          )
        );
      }
      res.json(
        BaseResponse.success(
          {},
          `Event with ID ${req.params.id} already deleted.`,
          "false"
        )
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = paymentController;
