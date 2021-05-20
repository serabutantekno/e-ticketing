'use strict';
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
      models.Event.belongsTo(models.User, { through: 'creator_id', foreignKey: 'id' })

      User.hasMany(models.Payment, { foreignKey: 'participant_id', as: 'participant' })
      // models.Payment.belongsTo(models.User, { through: 'participant_id', foreignKey: 'id', as: 'participant' })
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
    tableName: 'Users',
    paranoid: true
  });
  return User;
};
