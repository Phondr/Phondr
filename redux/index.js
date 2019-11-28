import {combineReducers} from 'redux'
import user from './user'
import myChats from './myChats'
import messages from './message'
import currentChat from './currentChat'
import loading from './loading'

const appReducer = combineReducers({
  user,
  myChats,
  messages,
  currentChat,
  loading
})

export default appReducer
