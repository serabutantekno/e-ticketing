const { User } = require('../db/models')
const { BaseResponse } = require('../helpers')


class userController {

  static async photoUpload(req, res) {
    const update = await User.update({ photo: req.file.filename }, {
      where: {
        id: req.user.id
      }
    })
    if(update[0]) {
      res.json(BaseResponse.success(await userController.getUser(req.user.id), 'Photo uploaded successfully.'))
    }
  }

  static async getProfile(req, res, next) {
    try {
      res.json(BaseResponse.success(await userController.getUser(req.user.id), 'User profile retrieved successfully.'))
    } catch (err) {
      next(err)
    }
  }

  static async deleteProfile(req, res) {
    const user = await userController.getUser(req.user.id)
    const user_update = await user.update({ deleted_at: new Date() })

    req.user.deleted_at = String(user_update.deleted_at)

    Object.assign(req.user, { deleted_at: user_update.deleted_at })

    res.json(BaseResponse.success(await userController.getUser(req.user.id), 'User deleted successfully.'))
  }

  static async getUsers(req, res) {
    const users = await User.findAll()
    if (users) {
      res.json(BaseResponse.success(users, 'All user data retrieved successfully.'))
    }
  }

  static async getUserById(req, res, next) {
    try {
      const data = await User.findByPk(req.params['id'])
      if (data) {
        res.json(BaseResponse.success(data, 'User data retrieved successfully.'))
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
        res.json(BaseResponse.success(await userController.getUser(req.params.id), 'User data updated successfully.'))
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
        res.json(BaseResponse.success(await userController.getUser(req.user.id), 'User data updated successfully.'))
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
