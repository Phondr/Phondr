import axios from 'axios'
import {url} from '../secrets'

const UPDATEPENDINGLOCATION = 'UPDATEPENDINGLOCATION'
const UPDATEPENDINGDATE = 'UPDATEPENDINGDATE'
const CLEARINVITATION = 'CLEARINVITATION'
// const UPDATEPENDINGNAME='UPDATEPENDINGNAME'
export const updatePendingLocation = (coords, name, address, rating) => {
  return {type: UPDATEPENDINGLOCATION, coords, name, address, rating}
}
export const updatePendingDate = date => {
  return {type: UPDATEPENDINGDATE, date}
}
export const clearInvitation = () => {
  return {type: CLEARINVITATION}
}

// export const updatePendingName = name =>{
//   return {type:updatePendingName}
// }

const reducer = (invitation = {}, action) => {
  switch (action.type) {
    case UPDATEPENDINGLOCATION:
      return {
        ...invitation,
        coords: action.coords,
        name: action.name,
        address: action.address,
        rating: action.rating
      }
    case UPDATEPENDINGDATE:
      return {...invitation, date: action.date}
    case CLEARINVITATION:
      return {}
    default:
      return invitation
  }
}
export default reducer
