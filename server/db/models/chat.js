const Sequelize = require('sequelize')
const db = require('../db')
const roundDown = require('lodash.floor')

const Chat = db.define('chat', {
  expirationDate: {
    type: Sequelize.STRING,
    allowNull: false //Set default value late
  },
  progress: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
    max: 100.0,
    min: 0.0
  },
  status: {
    type: Sequelize.ENUM('pending', 'active', 'closed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  sinceCreation: {
    type: Sequelize.DATE,
    get() {
      const start = this.getDataValue('sinceCreation')
      const now = new Date()
      console.log('TCL: start', start, now)

      const diffMs = now - start
      console.log('TCL: diffMs', diffMs)

      const seconds = roundDown((diffMs / 1000) % 60)
      const minutes = roundDown(diffMs / (1000 * 60))
      const hours = roundDown((diffMs / (1000 * 60 * 60)) % 24)
      return minutes
    }
  }
})

Chat.beforeCreate(chat => {
  chat.sinceCreation = new Date()
})

module.exports = Chat
