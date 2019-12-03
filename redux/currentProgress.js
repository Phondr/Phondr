import axios from 'axios'
import {url} from '../secrets'

const SETCURRENTPROGRESS = 'SETCURRENTPROGRESS'
export const setCurrentProgress = prog => {
  return {type: SETCURRENTPROGRESS, prog}
}

const reducer = (progress = 0, action) => {
  switch (action.type) {
    case SETCURRENTPROGRESS:
      return action.prog

    default:
      return progress
  }
}

export default reducer
