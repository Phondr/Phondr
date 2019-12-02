const SETLOADING = 'SETLOADING'
export const setLoading = bool => {
  return {type: SETLOADING, bool}
}

const reducer = (loading = true, action) => {
  switch (action.type) {
    case SETLOADING:
      return action.bool

    default:
      return loading
  }
}
export default reducer
