const { Event } = require('../db/models')
const { BaseResponse } = require('../helpers')


class eventController {

  static async getEvents(req, res, next) {
    try {
      if (req.user.role === 'admin') {
        const events = await Event.findAll()
        if (events) {
          res.json(BaseResponse.success(events, 'All events retrieved successfully.'))
        }

      } else if (req.user.role === 'creator') {
        const events = await Event.findAll({
          where: {
            creator_id: req.user.id
          }
        })
        if (events) {
          res.json(BaseResponse.success(events, 'All events retrieved successfully.'))
        }
      } else if (req.user.role === 'participant') {
        const events = await Event.findAll({
          where: {
            status: 'release'
          }
        })
        if (events) {
          res.json(BaseResponse.success(events, 'All events retrieved successfully.'))
        }
      }
    } catch (error) {
      next(error)
    }
  }

  static async getEventById(req, res, next) {
    try {
      const event = await Event.findByPk(req.params.id)
      if (event) {
        res.json(BaseResponse.success(event, 'An event with ID = ' + req.params.id + ' retrieved successfully.'))
      } else {
        res.json(BaseResponse.success(event, `An event with ID ${req.params.id} not found.`, 'false'))
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

  static async updateEvent(req, res, next) {
    try {
      await Event.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      res.json(BaseResponse.success(await Event.findByPk(req.params.id), 'Event with ID = ' + req.params.id + ' updated successfully.'))
    } catch (error) {
      next(error)
    }
  }

  static async deleteEvent(req, res, next) {
    try {
      console.log('id = '+req.params.id)
      await Event.destroy({ where: { id:req.params.id } })
      res.json(BaseResponse.success(Event.findByPk(req.params.id), `Event with ID ${req.params.id} deleted successfylly.`))
    } catch (error) {
      next(error)
    }
  }

}


module.exports = eventController
