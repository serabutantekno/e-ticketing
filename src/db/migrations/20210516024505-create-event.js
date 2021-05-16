'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      title_event: {
        type: Sequelize.STRING
      },
      link_webinar: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      banner: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.FLOAT
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('draft', 'release')
      },
      event_start_date: {
        type: Sequelize.DATE
      },
      event_end_date: {
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
};
