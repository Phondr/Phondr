let url = 'https://b1830fc7.ngrok.io'
const googlePlaceApiKey = `AIzaSyBCmg-KBnHeXTwvTgujd4DJsni6rW7x38A`

const amazonImageConfig = {
  keyPrefix: 'images/',
  bucket: 'phondr',
  region: 'us-east-2',
  accessKey: 'AKIAIXU2UF6F4HTS4J6A',
  secretKey: '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',
  successActionStatus: 201
}

const amazonConfig = {
  keyPrefix: 'uploads/',
  bucket: 'phondr',
  region: 'us-east-2',
  accessKey: 'AKIAIXU2UF6F4HTS4J6A',
  secretKey: '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',
  successActionStatus: 201
}

module.exports = {
  url,
  googlePlaceApiKey,
  amazonImageConfig,
  amazonConfig
}
