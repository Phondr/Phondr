const Sequelize = require('sequelize')
const db = require('../db')

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
      const diffMins = ((diffMs % 86400000) % 3600000) / 60000
      console.log('TCL: diffMins', diffMins)

      return diffMins
    }
  }
})

Chat.prototype.sinceMins = function(date) {
  const start = date || this.getDataValue('createdAt')
  const now = new Date()

  const diffMs = now - start

  const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000)

  return diffMins
}
Chat.beforeCreate(chat => {
  chat.sinceCreation = new Date()
})

module.exports = Chat
