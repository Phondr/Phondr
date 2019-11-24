import { combineReducers } from 'redux'
import user from './user'
import myChats from './myChats'

const appReducer = combineReducers({
  user,
  myChats,
})

export default appReducer
