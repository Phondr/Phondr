const SET_CHAT = 'SET_CHAT'

export const setChat = chat => {
  return {type: SET_CHAT, chat}
}

const reducer = (chat = {}, action) => {
  switch (action.type) {
    case SET_CHAT:
      return action.chat
    default:
      return chat
  }
}

export default reducer
