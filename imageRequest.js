const {placesAPI, url} = require('./secrets')
const axios = require('axios')
const cheerio = require('cheerio')

const imageRequest = async ref => {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${placesAPI}`
  const image = await axios.post(url)

  return image.config.url
}

const cheerioReq = async link => {
  let {data} = await axios.get(link)

  const $ = cheerio.load(data)

  let imageUrl = ''
  // $('meta').each((i, cur) => {
  //   console.log('i', i)
  //   console.log('cur.attr', cur.attribs)
  //   if (cur.attribs.property === 'og:image') {
  //     imageUrl = cur.attribs.content
  //   }
  // })
  imageUrl = $('meta[property="og:image"]').attr('content')

  return imageUrl
}

module.exports = {cheerioReq, imageRequest}
