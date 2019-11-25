import client from './apolloClient'
import gql from 'graphql-tag'
import myAxios from './axios-config'

const GETMYCHATS = 'GETMYCHATS'
const ADDCHAT = 'ADDCHAT'
const addChat = newChat => {
  return {type: ADDCHAT, newChat}
}
const getMyChats = myChats => {
  return {type: GETMYCHATS, myChats}
}
export const findOrCreateChat = uid => {
  return async dispatch => {
    try {
      const {data} = await client.mutate({
        mutation: gql`mutation{
                    findOrCreateChat(userId:${uid}){
                        id
                        status
                        users{
                            id
                            fullName
                        }
                    }
                }`
      })
      console.log('TCL: findOrCreateChat', data)
      dispatch(addChat(data.findOrCreateChat))
    } catch (e) {
      console.error('messed up in focc thunk: ', e)
    }
  }
}
export const fetchMyChats = uid => {
  return async dispatch => {
    try {
      const {data} = await client.query({
        query: gql`
            query {
              myChats(userId: ${uid}) {
                id
                status
                users {
                  id
                  fullName
                }
              }
            }
          `
      })

      console.log('data in thunk', data)
      dispatch(getMyChats(data.myChats))
      //   const {
      //     data: {
      //       data: { myChats },
      //     },
      //   } = myAxios.post('/', {
      //     query: `
      //      query{
      //          myChats(userId:${uid}){
      //              progress
      //              status
      //              id
      //              users{
      //                  id
      //                  fullName
      //              }
      //          }
      //      }
      //     `,
      //   })
      //   console.log('data object in myChats', myChats)
      //   dispatch(getMyChats(myChats))
    } catch (e) {
      console.error('messed up in fetchMyChats, error: ', e)
    }
  }
}

const reducer = (chats = [], action) => {
  switch (action.type) {
    case GETMYCHATS:
      return action.myChats
    case ADDCHAT:
      return [...chats, action.newChat]
    default:
      return chats
  }
}

export default reducer
