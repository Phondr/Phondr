const {placesAPI, url} = require('../../../secrets')
const axios = require('axios')

const imageRequest = async ref => {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${placesAPI}`
  const image = await axios.post(url)
  //console.log('TCL: image', image)

  return image.config.url
}

export default imageRequest
