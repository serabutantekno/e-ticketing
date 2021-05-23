'use strict';

const bcrypt = require('bcrypt')
const faker = require('faker')


const generateDummyUser = (howMany) => {
  const data = []

  data.push({
    username: 'superuser',
    fullname: 'superuser',
    email: 'superuser@domain.com',
    password: bcrypt.hashSync('superuser', bcrypt.genSaltSync(10)),
    role: 'superuser',
    confirmed_at: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }, {
    username: 'admin',
    fullname: 'admin',
    email: 'admin@domain.com',
    password: bcrypt.hashSync('admin', bcrypt.genSaltSync(10)),
    role: 'admin',
    confirmed_at: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }, {
    username: 'creator',
    fullname: 'creator',
    email: 'creator@domain.com',
    password: bcrypt.hashSync('creator', bcrypt.genSaltSync(10)),
    role: 'creator',
    confirmed_at: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  })

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
