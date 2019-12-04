/* eslint-disable no-case-declarations */
import client from './apolloClient'
import gql from 'graphql-tag'
import myAxios from './axios-config'
import axios from 'axios'
import {url} from '../secrets'

const GETMYCHATS = 'GETMYCHATS'
const ADDCHAT = 'ADDCHAT'
const REMOVECHAT = 'REMOVECHAT'
const removeChat = badChat => {
  return {type: REMOVECHAT, badChat}
}
const addChat = newChat => {
  return {type: ADDCHAT, newChat}
}
const getMyChats = myChats => {
  return {type: GETMYCHATS, myChats}
}
export const deleteChat = (chatId, userId) => {
  return async dispatch => {
    try {
      console.log('chatId in thunk', chatId)
      const {data} = await myAxios.post('', {
        query: `mutation{
          deleteChat(chatId:${chatId}){
            id
          }
        }`
      })

      console.log('TCL: data.data.deleteChat.id', data.data.deleteChat.id)
      dispatch(removeChat(data.data.deleteChat.id))
    } catch (error) {
      console.error('messed up in deleteChat thunk', error)
    }
  }
}
export const findOrCreateChat = uid => {
  return async dispatch => {
    try {
      const {
        data: {
          data: {findOrCreateChat}
        }
      } = await myAxios.post('', {
        query: `mutation{
          findOrCreateChat(userId:${uid}){
            id
            status
            users{
              id
              fullName
            }
          }
        }`
      })

      dispatch(addChat(findOrCreateChat))
    } catch (e) {
      console.error('messed up in focc thunk: ', e)
    }
  }
}
export const fetchMyChats = uid => {
  return async dispatch => {
    try {
      console.log('uid in chat', uid)
      const {data} = await axios.post(`${url}/graphql`, {
        query: `query{
               myChats(userId:${uid}){
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
              }
             `
      })

      dispatch(getMyChats(data.data.myChats))
    } catch (e) {
      console.error('messed up in fetchMyChats, error: ', e)
    }
  }
}

const reducer = (chats = [], action) => {
  switch (action.type) {
    case GETMYCHATS:
      return action.myChats
    case ADDCHAT:
      return [...chats, action.newChat]
    case REMOVECHAT:
      const updated = chats.filter(cur => cur.id !== action.badChat)
      return updated
    default:
      return chats
  }
}

export default reducer
