const { User } = require('../db/models')


class userController {

  static async register(req, res) {
    try {
      const data = await User.create(req.body)
      res.json(data)
    } catch (error) {
      console.log(error)
      res.json({'message': 'something wrong'})
    }
  }

}


module.exports = userController
