import axios from 'axios'
import {url} from '../secrets'

const SETALLMEETINGS = 'SETALLMEETINGS'
const setAllMeetings = meetings => {
  return {type: SETALLMEETINGS, meetings}
}

export const fetchAllMeetings = userId => {
  return async dispatch => {
    try {
      const {data} = await axios.post(`${url}/graphql`, {
        query: `
      query{
       getAllMeetings(userId:${userId}){
        name
        link
        imageRef
        rating
        address
        date
        chatId
        senderId
        id
        status
       }
      }`
      })
      dispatch(setAllMeetings(data.data.getAllMeetings))
    } catch (error) {
      console.error('messed up in fetchAllMeetings: ', error)
    }
  }
}

const reducer = (meetings = [], action) => {
  switch (action.type) {
    case SETALLMEETINGS:
      return action.meetings

    default:
      return meetings
  }
}

export default reducer
