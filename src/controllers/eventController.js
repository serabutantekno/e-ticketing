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
      const query = `SELECT e.id AS event_id, e.title_event, e.description, COUNT(p.participant_id) AS total_participant, SUM(p.amount) as total_amount, u.fullname AS creator
      FROM Users u
      INNER JOIN Events e ON e.creator_id = u.id
      INNER JOIN Payments p ON p.event_id = e.id
      GROUP BY e.id
      ORDER BY total_amount DESC, total_participant DESC`
      const [results, metadata] = await db.sequelize.query(query)
      const result = JSON.parse(JSON.stringify(results[0]))
      res.status(200).json(BaseResponse.success(result))
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
