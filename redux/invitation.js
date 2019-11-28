const UPDATEPENDINGLOCATION = 'UPDATEPENDINGLOCATION'
const UPDATEPENDINGDATE = 'UPDATEPENDINGDATE'
export const updatePendingLocation = location => {
  return {type: UPDATEPENDINGLOCATION, location}
}
export const updatePendingDate = date => {
  return {type: UPDATEPENDINGDATE, date}
}

const reducer = (invitation = {}, action) => {
  switch (action.type) {
    case UPDATEPENDINGLOCATION:
      return {...invitation, location: action.location}
    case UPDATEPENDINGDATE:
      return {...invitation, date: action.date}
    default:
      return invitation
  }
}
export default reducer
