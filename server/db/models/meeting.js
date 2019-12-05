const Sequelize = require('sequelize')
const db = require('../db')
const {cheerioReq} = require('../../../imageRequest')

const Meeting = db.define('meeting', {
  location: {
    type: Sequelize.ARRAY(Sequelize.FLOAT)
  },
  link: {
    type: Sequelize.STRING
  },
  imageRef: {
    type: Sequelize.STRING,
    get() {
      const ref = this.getDataValue('link')
      if (ref && ref.length) {
        // const googleImage = await imageRequest(ref)
        // return googleImage
        const cheerioImage = cheerioReq(ref)
        return cheerioImage
      }

      return ''
    }
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
  },
  status: {
    type: Sequelize.ENUM(['pending', 'active', 'declined'])
  }
})

module.exports = Meeting
