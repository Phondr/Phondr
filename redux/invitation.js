const UPDATEPENDINGLOCATION = 'UPDATEPENDINGLOCATION'
const UPDATEPENDINGDATE = 'UPDATEPENDINGDATE'
// const UPDATEPENDINGNAME='UPDATEPENDINGNAME'
export const updatePendingLocation = (coords, name) => {
  return {type: UPDATEPENDINGLOCATION, coords, name}
}
export const updatePendingDate = date => {
  return {type: UPDATEPENDINGDATE, date}
}
// export const updatePendingName = name =>{
//   return {type:updatePendingName}
// }

const reducer = (invitation = {}, action) => {
  switch (action.type) {
    case UPDATEPENDINGLOCATION:
      return {...invitation, coords: action.coords, name: action.name}
    case UPDATEPENDINGDATE:
      return {...invitation, date: action.date}
    default:
      return invitation
  }
}
export default reducer
