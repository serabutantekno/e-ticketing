const db = require('../db/models')
const { BaseResponse } = require('../helpers')
const _ = require('lodash')
const { result } = require('lodash')


class eventController {

  static async getEvents(req, res, next) {
    try {
      if (req.user.role === 'admin') {
        const events = await db.Event.findAll()
        if (events) {
          res.json(BaseResponse.success(events, 'All events retrieved successfully.'))
        }

      } else if (req.user.role === 'creator') {
        const events = await db.Event.findAll({
          where: {
            creator_id: req.user.id
          }
        })
        if (events) {
          res.json(BaseResponse.success(events, 'All events retrieved successfully.'))
        }
      } else if (req.user.role === 'participant') {
        const events = await db.Event.findAll({
          where: {
            status: 'release'
          },
          include: db.User
        })
        if (events) {
          res.json(BaseResponse.success(events, 'All events retrieved successfully.'))
        }
      }
    } catch (error) {
      next(error)
    }
  }

  static async getCreatorDoneEvents(req, res, next) {
    try {
      // const query = `SELECT e.title_event, e.link_webinar, e.description, e.banner, e.price, e.quantity, e.status, e.event_start_date, e.event_end_date FROM Events e WHERE e.creator_id = ${req.user.id} AND e.status = 'release' AND e.event_end_date < CURRENT_TIMESTAMP()`
      const query = `SELECT e.id AS event_id, p.id AS payment_id, u.id, u.username, u.email, e.title_event, e.link_webinar, e.description, e.banner, e.price, e.quantity, e.status, e.event_start_date, e.event_end_date
      FROM Events e
      JOIN Payments p ON e.id = p.event_id
      JOIN Users u ON p.participant_id = u.id
      WHERE e.creator_id = 211 AND e.status = 'release' AND e.event_end_date < CURRENT_TIMESTAMP()
      GROUP BY e.id, p.id`
      const [results, metadata] = await db.sequelize.query(query)
      console.log('hasil: ====================')
      console.log(results)
      const result = JSON.parse(JSON.stringify(results[0]))

      /** remove these properties */
      delete result.id
      delete result.username
      delete result.email

      const participants = results.map(x => {
        return {
          id: x.id,
          username: x.username,
          email: x.email
        }
      })
      res.status(200).json(BaseResponse.success(Object.assign({
        participants: participants,
        participants_count: participants.length
      }, result), 'Retrieving finished events.'))
    } catch (error) {
      next(error)
    }
  }

  static async getEventById(req, res, next) {
    try {
      const event = await db.Event.findByPk(req.params.id)
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
      const newEvent = await db.Event.create(
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
      await db.Event.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      res.json(BaseResponse.success(await db.Event.findByPk(req.params.id), 'Event with ID = ' + req.params.id + ' updated successfully.'))
    } catch (error) {
      next(error)
    }
  }

  static async deleteEvent(req, res, next) {
    try {
      console.log('id = '+req.params.id)
      await db.Event.destroy({ where: { id:req.params.id } })
      res.json(BaseResponse.success(db.Event.findByPk(req.params.id), `Event with ID ${req.params.id} deleted successfylly.`))
    } catch (error) {
      next(error)
    }
  }

}


module.exports = eventController
