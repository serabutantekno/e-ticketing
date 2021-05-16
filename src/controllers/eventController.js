const { Event } = require('../db/models')
const { BaseResponse } = require('../helpers')


class eventController {

  static async getEvents(req, res, next) {
    try {
      const events = await Event.findAll()
      if (events) {
        res.json(BaseResponse.success(events, 'All events retrieved successfully.'))
      }
    } catch (error) {
      next(error)
    }
  }

  static async createEvent(req, res, next) {
    try {
      const newEvent = await Event.create(
        Object.assign(req.body, { creator_id: req.user.id })
      )
      if (newEvent) {
        res.json(BaseResponse.success(newEvent, 'New event added.'))
      }
    } catch (error) {
      next(error)
    }
  }

}


module.exports = eventController
