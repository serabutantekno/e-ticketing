const { Event, Payment, User } = require("../db/models");
const { BaseResponse } = require("../helpers");
const sendMail = require("./sendMailController");

class paymentController {
  static async getPayments(req, res, next) {
    try {
      let result
      if (req.user.role === 'creator') {
        return res.json(BaseResponse.success(await Payment.findAll({
          include: {
            model: Event,
            as: 'event',
            where: {
              creator_id: req.user.id
            },
            attributes: []
          }
        })))
        res.json(
          BaseResponse.success(
            await Payment.findAll({
              include: {
                model: Event,
                as: 'event',
                where: {
                  creator_id: req.user.id
                }
              }
            }),
            "Payments retrieved successfully."
          )
        );
      }

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
        // include: [
        //   {
        //     model: User,
        //     required: true,
        //     as: "participant",
        //   },
        // ],
        include: 'participant'
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
            as: "participants",
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
