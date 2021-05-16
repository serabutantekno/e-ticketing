const jwt = require('jsonwebtoken')
const { User } = require('../db/models')
const { BaseResponse } = require('../helpers')
const sendMail = require('./sendMailController')
const userController = require('./userController')
const TemplateData = require('./templateData')
const bcrypt = require('bcrypt')


class registerController {

  static async register(req, res, next) {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body['password'], salt)
      const data = await User.create(
        Object.assign(req.body, { password: hashedPassword })
      )
      const base64data_encode = Buffer.from((data.id + ':' + data.email), 'utf8').toString('base64')
      sendMail(data.email, base64data_encode)
      res.json(BaseResponse.success(TemplateData.userData(data), 'User registered.'))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }


  static async verify(req, res, next) {
    const base64data_decode = Buffer.from(req.params.token, 'base64').toString('utf8')
    const [id, email] = base64data_decode.split(':')
    const user = await userController.getUser(id)
    if (user && user.email === email) {
      try {
        user.update({ confirmed_at: new Date })
        res.json(BaseResponse.success(TemplateData.userData(user), 'User registered.'))
      } catch (err) {
        console.log(err)
      }
    }
  }


  static async login(req, res) {
    try {
      const currentUser = await User.findOne({
        where: {
          username: req.body.username
        }
      })
      if (currentUser.confirmed_at || currentUser.role === 'admin') {
        if (currentUser.deleted_at) return res.json({ message: 'this account has been deleted' })

        const passwordCheck = await bcrypt.compare(req.body.password, currentUser.password)
        if (passwordCheck) {
          const payload = JSON.parse(JSON.stringify(currentUser))

          delete payload.password
          delete payload.createdAt
          delete payload.updatedAt

          const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '2h' })  // expire in specific time
          res.status(200).json(BaseResponse.success(TemplateData.userData(currentUser, { token: token }), 'Login succeed.'))
        } else {
          res.status(400).json({ message: 'invalid password' })
        }
      } else {
        res.json({ message: 'please verify your email address' })
      }
    } catch (error) {
      console.log(error)
      res.json({ message: 'something wrong' })
    }
  }

}


module.exports = registerController
