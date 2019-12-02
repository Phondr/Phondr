import {combineReducers} from 'redux'
import user from './user'
import myChats from './myChats'
import messages from './message'
import currentChat from './currentChat'

const appReducer = combineReducers({
  user,
  myChats,
  messages,
  currentChat
})

export default appReducer
