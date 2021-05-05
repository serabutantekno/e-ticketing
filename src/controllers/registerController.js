const jwt = require('jsonwebtoken')
const { User } = require('../db/models')
const bcrypt = require('bcrypt')


class registerController {

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
        const passwordCheck = await bcrypt.compare(req.body.password, currentUser.password)
        if (passwordCheck) {
          const payload = JSON.parse(JSON.stringify(currentUser))

          delete payload.password
          delete payload.createdAt
          delete payload.updatedAt

          const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '2h' })  // expire in specific time
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

}


module.exports = registerController
