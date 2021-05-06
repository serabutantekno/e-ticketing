'use strict';

const bcrypt = require('bcrypt')
const faker = require('faker')

// const salt = await bcrypt.genSalt(10)
// const hashedPassword = await bcrypt.hash(req.body['password'], salt)

const generateDummyUser = (howMany) => {
  const data = []
  for(let i = 0; i < howMany; i++) {
    data.push({
      username: faker.internet.userName(),
      fullname: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'participant',
      confirmed_at: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
  return data
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    return queryInterface.bulkInsert('Users', generateDummyUser(100));
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
