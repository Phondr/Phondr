import { combineReducers } from 'redux'
import user from './user'
import myChats from './myChats'
import messages from './message'

const appReducer = combineReducers({
  user,
  myChats,
  messages,
})

export default appReducer
