const ngrok = require('ngrok')
let url = ''
const startNgrok = async function() {
  url = await ngrok.connect()
}
startNgrok()

const SET_NGROK = 'SET_NGROK'
const setNgrok = ngrokUrl => {
  return { type: SET_NGROK, ngrokUrl }
}

const reducer = (state = url, action) => {
  switch (action.type) {
    case SET_NGROK:
      return action.ngrokUrl

    default:
      break
  }
}

export default reducer
