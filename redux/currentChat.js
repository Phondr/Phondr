const SET_CHAT = 'SET_CHAT'
import axios from 'axios'
import {url} from '../secrets'

export const setChat = chat => {
  return {type: SET_CHAT, chat}
}

export const fetchCurrentChat = chatId => {
  return async dispatch => {
    try {
      const {data} = await axios.post(`${url}/graphql`, {
        query: `query{
           getCurrentChat(chatId:${chatId}){
            progress
            status
            sinceCreation
             id
              messages{
                id
                 userId
             }
               users{
                id
                fullName
                 }
           }
         }`
      })
      dispatch(setChat(data.data.getCurrentChat))
    } catch (error) {
      console.error('messed up in fetchCurrentChat', error)
    }
  }
}

const initialChat = {messages: []}
const reducer = (chat = initialChat, action) => {
  switch (action.type) {
    case SET_CHAT:
      return action.chat
    default:
      return chat
  }
}

export default reducer
