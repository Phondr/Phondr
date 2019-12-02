import axios from 'axios'
import {url} from '../secrets'
import {clearInvitation} from './invitation'

const SETCURRENTMEETING = 'SETCURRENTMEETING'
const setCurrentMeeting = meeting => {
  return {type: SETCURRENTMEETING, meeting}
}

export const createMeeting = (chatId, userId, invitation) => {
  console.log('TCL: userId', userId)
  console.log('TCL: chatId', chatId)
  console.log('TCL: invitation', invitation)
  console.log('url', url)
  return async dispatch => {
    try {
      const dateString = invitation.date.toDateString()
      console.log('TCL: dateString', dateString)

      const {data} = await axios.post(`${url}/graphql`, {
        query: `mutation{
             newMeeting(chatId:${chatId}, userId:${userId}, latitude:${invitation.coords[0]},longitude:${invitation.coords[1]},name:${invitation.name},rating:${invitation.rating},address:${invitation.address},date:${dateString}){
                location
                name
                rating
                address
                date
                senderId
                chatId
             }
          }`
      })
      console.log('TCL: data', data)
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
