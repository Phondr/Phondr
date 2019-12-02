const Sequelize = require('sequelize')
const db = require('../db')

const Meeting = db.define('meeting', {
  location: {
    type: Sequelize.ARRAY(Sequelize.FLOAT)
  },
  name: {
    type: Sequelize.STRING
  },
  rating: {
    type: Sequelize.FLOAT
  },
  address: {
    type: Sequelize.STRING
  },
  senderId: {
    type: Sequelize.INTEGER
  },
  date: {
    type: Sequelize.DATE
    // allowNull: false,
  }
})

module.exports = Meeting
