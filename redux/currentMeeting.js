import myAxios from './axios-config'
import axios from 'axios'
import {url} from '../secrets'
import {clearInvitation} from './invitation'
import {gql} from 'graphql-tag'

const UPDATEMEETING = 'UPDATEMEETING'
const SETCURRENTMEETING = 'SETCURRENTMEETING'
const setCurrentMeeting = meeting => {
  return {type: SETCURRENTMEETING, meeting}
}

export const updateMeeting = (meetingId, status) => {
  return async dispatch => {
    try {
      const {data} = await axios.post(`${url}/graphql`, {
        query: `mutation{
          updateMeeting(meetingId:${meetingId},status:"${status}"){
            id
            status
            link
            name
            address
            date
            chatId
            senderId
          }
        }`
      })
      dispatch(setCurrentMeeting(data.data.updateMeeting))
    } catch (error) {
      console.error('error in updateMeeting', error)
    }
  }
}
export const fetchMeeting = chatId => {
  return async dispatch => {
    try {
      const {data} = await axios.post(`${url}/graphql`, {
        query: `query{
          fetchMeeting(chatId:${chatId}){
            id
            status
            link
            name
            address
            date
            chatId
            senderId
          }
        }`
      })
      dispatch(setCurrentMeeting(data.data.fetchMeeting))
    } catch (error) {
      console.error('error in updateMeeting', error)
    }
  }
}
export const createMeeting = (chatId, userId, invitation) => {
  return async dispatch => {
    try {
      invitation.date = invitation.date.toString()
      const {data} = await axios.post(`${url}/graphql`, {
        query: `mutation newMeeting($inv:Invitation){
           newMeeting(chatId:${chatId}, userId:${userId}, invitation:$inv){
               location
               name
               rating
               address
               link
               imageRef
               date
               senderId
               status
               chatId
               id
            }
         }`,
        variables: {inv: invitation}
      })
      console.log('made it here')
      dispatch(setCurrentMeeting(data.data.newMeeting))
      clearInvitation()
    } catch (error) {
      console.error('messed up in createMeeting: ', error)
    }
  }
}

const reducer = (meeting = {}, action) => {
  switch (action.type) {
    case SETCURRENTMEETING:
      return action.meeting

    default:
      return meeting
  }
}
export default reducer
