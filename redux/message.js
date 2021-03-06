import client from './apolloClient'
import gql from 'graphql-tag'
import axios from 'axios'
import {url} from '../secrets'
import {placesAPI} from '../secrets'

const GET_MESSAGES = 'GET_MESSAGES'
const NEW_MESSAGE = 'NEW_MESSAGE'

const getMessages = messages => {
  return {type: GET_MESSAGES, messages}
}
export const setNewMessage = message => {
  return {type: NEW_MESSAGE, message}
}

export const fetchMessages = chatId => {
  return async dispatch => {
    try {
      //Add in user{avatar: profilePicture} when they unlock this to show profile picture in chat instead of initials
      const {data} = await axios({
        url: url + '/graphql',
        method: 'POST',
        data: {
          query: `
          {
            messages(chatId: ${chatId}) {
              _id: id,
              text: content,
              length,
              audio,
              image:imageRef,
              createdAt,
              meetingId,
              userId,
              chatId,
              user {
                _id: id,
                name: fullName,
                email,
              }
              
            }
          }
          `
        }
      })

      const formatedMessage = data.data.messages.map(message => {
        message.createdAt = new Date(Number(message.createdAt))
        if (message.text.includes('++New Invitation To Meet!')) {
          message.text = message.text.split('++').join('\n')
        }
        return message
      })
      //console.log('data in thunk', formatedMessage)
      dispatch(getMessages(formatedMessage))
    } catch (e) {
      console.error('messed up in fetchMes, error: ', e)
    }
  }
}
const imageRequest = async ref => {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${placesAPI}`
  const image = await axios.post(url)
  

  return image.config.url
}
export const newMessage = message => {
  return async dispatch => {
    try {
      const imageRef = message.imageRef || ''
      const meetingId = message.meetingId || 0
      const {data} = await axios.post(url + '/graphql', {
        query: `
          mutation{
            newMessage(content: "${message.content}", length: ${
          message.length
        }, userId: ${message.userId}, chatId: ${message.chatId}, ${
          message.audio ? `audio: "${message.audio}"` : ''
        }, imageRef:"${imageRef}", meetingId:${meetingId}) {
              _id: id,
              text: content,
              createdAt,
              length,
              audio,
              meetingId,
              image: imageRef,
              userId,
              chatId,
              user {
                _id: id,
                email,
                name: fullName,
              }
            }
          }
          `
      })
      // if (data.data.newMessage.imageRef.length) {
      //   const googleImage = await imageRequest(data.data.newMessage.imageRef)
      //   data.data.newMessage.image = googleImage
      // }
      //Format into readable date by gifted chat
      if (data.data.newMessage.text.includes('++New Invitation To Meet!')) {
        data.data.newMessage.text = data.data.newMessage.text
          .split('++')
          .join('\n')
      }
      data.data.newMessage.createdAt = new Date(
        Number(data.data.newMessage.createdAt)
      )
      return data.data.newMessage
    } catch (e) {
      console.error('messed up in newMessages, error: ', e)
    }
  }
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return action.messages
    case NEW_MESSAGE:
      return [action.message, ...state]
    default:
      return state
  }
}

export default reducer
