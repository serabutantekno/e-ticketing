const jwt = require('jsonwebtoken')
const { User } = require('../db/models')
const bcrypt = require('bcrypt')


class userController {

  static async register(req, res) {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body['password'], salt)
      const data = await User.create(
        Object.assign(req.body, { password: hashedPassword })
      )
      res.json(data)
    } catch (error) {
      console.log(error)
      res.json({'message': 'something wrong'})
    }
  }


  static async login(req, res) {
    try {
      const currentUser = await User.findOne({
        where: {
          username: req.body.username
        }
      })
      if (currentUser) {
        const passwordCheck = await bcrypt.compare(req.body['password'], currentUser.password)
        if (passwordCheck) {
          const token = jwt.sign({ user: currentUser.username }, process.env.TOKEN_SECRET, { expiresIn: '1m' })  // expire in 8 hours
          res.status(200).json(token)
        } else {
          res.status(400).json({ message: 'invalid password' })
        }
      } else {
        res.json({ message: 'no data' })
      }
    } catch (error) {
      console.log(error)
      res.json({ message: 'something wrong' })
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
