const Sequelize = require('sequelize')
const db = require('../db')

const Chat = db.define('chat', { 
  expirationDate: {
    type: Sequelize.STRING,
    allowNull: false,  //Set default value late 
  },
  progress: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: Sequelize.ENUM('pending', 'active', 'closed'),
    allowNull: false,
    defaultValue: 'pending',
  }
})

module.exports = Chat


