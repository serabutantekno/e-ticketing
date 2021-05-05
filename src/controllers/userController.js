const { User } = require('../db/models')


class userController {

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
