const Sequelize = require('sequelize')
const db = require('../db')
const {placesAPI} = require('../../../secrets')
const axios = require('axios')

const {cheerioReq} = require('../../../imageRequest')

const Message = db.define('message', {
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  imageRef: {
    type: Sequelize.STRING,
    get() {
      const ref = this.getDataValue('imageRef')
      if (ref && ref.length) {
        const cheerioImage = cheerioReq(ref)
        return cheerioImage
      }

      return ''
    }
  },
  length: {
    type: Sequelize.INTEGER
    // allowNull: false,
  },
  audio: {
    type: Sequelize.STRING,
    defaultValue: null
  }
})

const imageRequest = async ref => {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${placesAPI}`
  const image = await axios.post(url)
  //console.log('TCL: image', image)

  return image.config.url
}

module.exports = Message
