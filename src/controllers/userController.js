const { User } = require('../db/models')


class userController {

  static async photoUpload(req, res) {
    const user = await userController.getUser(req.user.id)
    user.update({ photo: req.file.filename })
    res.json({
      sucess: true,
      message: 'photo uploaded',
      data: await userController.getUser(req.user.id)
    })
  }

  static async getProfile(req, res) {
    console.log(req.user.password)
    const user = await userController.getUser(req.user.id)
    res.json({
      sucess: true,
      message: 'success retrieving data',
      data: user
    })
  }

  static async deleteProfile(req, res) {
    const user = await userController.getUser(req.user.id)
    const user_update = await user.update({ deleted_at: new Date() })

    console.log(user_update.deleted_at)
    console.log(req.user)
    req.user.deleted_at = String(user_update.deleted_at)

    Object.assign(req.user, { deleted_at: user_update.deleted_at })

    res.json({
      sucess: true,
      message: 'delete data success',
      data: user_update
    })
  }

  static async getUsers(req, res, next) {
    const users = await User.findAll()
    if (users) {
      res.json({
        sucess: true,
        message: 'success retrieving data',
        data: users
      })
    }
  }

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

  static async getUser(id) {
    return await User.findOne({
      where: {
        id: id
      }
    })
  }

  static async updateUserById(req, res) {
    try {
      if (await userController.getUser(req.params.id)) {
        await User.update(req.body, {
          where: {
            id: req.params.id
          }
        })
        res.json({
          sucess: true,
          message: 'success updating user',
          data: await userController.getUser(req.params.id)
        })
      } else {
        res.json({
          sucess: false,
          message: 'updating user fails',
          data: null
        })
      }
    } catch (err) {
      console.log(err)
      res.json({
        sucess: false,
        message: err.message,
        data: null
      })
    }
  }

  static async updateProfile(req, res) {
    try {
      if (await userController.getUser(req.user.id)) {
        const data = await User.update(req.body, {
          where: {
            id: req.user.id
          }
        })
        res.json({
          sucess: true,
          message: 'success updating user',
          data: await userController.getUser(req.user.id)
        })
      } else {
        res.json({
          sucess: false,
          message: 'updating user fails',
          data: null
        })
      }
    } catch (err) {
      console.log(err)
      res.json({
        sucess: false,
        message: err.message,
        data: null
      })
    }
  }

}


module.exports = userController
