const { User } = require('../db/models')


class userController {

  static async getUserById(req, res, next) {
    try {
      const data = await User.findByPk(req.params['id'])
      if (data) {
        res.json({
          sucess: true,
          message: 'success retrieving data',
          data: data
        })
      } else {
        res.json({
          sucess: false,
          message: 'id not found',
          data: data
        })
      }
    } catch (error) {
      console.log(error)
      res.json({
          sucess: false,
          message: 'something wrong',
          data: data
        })
    } finally {
      next()
    }
  }

}


module.exports = userController
