const Sequelize = require('sequelize')
const db = require('../db')

const Message = db.define('message', {
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  length: {
    type: Sequelize.INTEGER,
    // allowNull: false,
  },
  audio: {
    type: Sequelize.STRING,
    defaultValue: null,
  }
})

module.exports = Message