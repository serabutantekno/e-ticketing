'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.User, { foreignKey: 'creator_id' })
      Event.hasMany(models.Payment, { foreignKey:'event_id' })
    }
  };
  Event.init({
    creator_id: DataTypes.INTEGER,
    title_event: DataTypes.STRING,
    link_webinar: DataTypes.STRING,
    description: DataTypes.TEXT,
    banner: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    status: DataTypes.ENUM('draft', 'release'),
    event_start_date: DataTypes.DATE,
    event_end_date: DataTypes.DATE,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'Events',
    paranoid: true,
    deletedAt: 'deleted_at'
  });
  return Event;
};
