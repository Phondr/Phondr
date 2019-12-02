import myAxios from './axios-config'
import axios from 'axios'
import {url} from '../secrets'
import {clearInvitation} from './invitation'
import {gql} from 'graphql-tag'

const SETCURRENTMEETING = 'SETCURRENTMEETING'
const setCurrentMeeting = meeting => {
  return {type: SETCURRENTMEETING, meeting}
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
               date
               senderId
               chatId
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
