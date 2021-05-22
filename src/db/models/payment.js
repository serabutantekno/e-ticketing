'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.User, { foreignKey: 'participant_id', as: 'participant' })
      Payment.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' })
    }
  };
  Payment.init({
    participant_id: DataTypes.INTEGER,
    event_id: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    payment_slip: DataTypes.STRING,
    payment_status: DataTypes.ENUM('unpaid', 'paid'),
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payments',
    paranoid: true,
    underscored: true,
  });
  return Payment;
};
