'use strict';

const Event = require('./event')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Event, { foreignKey: 'creator_id' })
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    photo: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'creator', 'participant'),
    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE
    },
    confirmed_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true
  });
  return User;
};
