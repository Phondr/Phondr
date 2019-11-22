const Sequelize = require('sequelize')
const db = require('../db')

const Meeting = db.define('meeting', {
  location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
    type: Sequelize.STRING,
    // allowNull: false,
  },
})

module.exports = Meeting