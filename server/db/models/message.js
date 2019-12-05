const Sequelize = require('sequelize')
const db = require('../db')
const {placesAPI, url} = require('../../../secrets')
const axios = require('axios')
const cheerio = require('cheerio')

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
        // const googleImage = await imageRequest(ref)
        // return googleImage
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

const cheerioReq = async link => {
  console.log('link inside cheerioReq: ', link)
  let {data} = await axios.get(link)

  const $ = cheerio.load(data.slice(0, 1000))

  console.log('TCL: data', data.slice(0, 1000))
  console.log('title', $('title').text())
  let imageUrl = ''
  // $('meta').each((i, cur) => {
  //   console.log('i', i)
  //   console.log('cur.attr', cur.attribs)
  //   if (cur.attribs.property === 'og:image') {
  //     imageUrl = cur.attribs.content
  //   }
  // })
  imageUrl = $('meta[property="og:image"]').attr('content')

  console.log('imageUrl inside of cheerioReq: ', imageUrl)

  return imageUrl
}

const imageRequest = async ref => {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${placesAPI}`
  const image = await axios.post(url)
  //console.log('TCL: image', image)

  return image.config.url
}

// Message.beforeCreate(message => {
//   if (message.imageRef) {
//     const googleImage = imageRequest(message.imageRef)
//     message.imageRef = googleImage
//   }
// })

module.exports = Message
