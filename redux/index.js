import {combineReducers} from 'redux'
import user from './user'
import myChats from './myChats'
import messages from './message'
import currentChat from './currentChat'
import loading from './loading'
import invitation from './invitation'
import currentMeeting from './currentMeeting'
import currentProgress from './currentProgress'

const appReducer = combineReducers({
  user,
  myChats,
  messages,
  currentChat,
  loading,
  invitation,
  currentMeeting,
  currentProgress
})

export default appReducer
