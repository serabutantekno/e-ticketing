const jwt = require('jsonwebtoken')
const { User } = require('../db/models')
const bcrypt = require('bcrypt')


class userController {

  static async register(req, res) {
    try {
      const hashedPassword = bcrypt.hashSync(req.body['password'], 8)
      const data = await User.create(
        Object.assign(req.body, { password: hashedPassword })
      )
      res.json(data)
    } catch (error) {
      console.log(error)
      res.json({'message': 'something wrong'})
    }
  }

  static async getUserById(req, res) {
    try {
      const data = await User.findByPk(req.params['id'])
      if (data) {
        res.json(data)
      } else {
        res.json({'message': 'id not found'})
      }
    } catch (error) {
      console.log(error)
      res.json({'message': 'something wrong'})
    }
  }

}


module.exports = userController
