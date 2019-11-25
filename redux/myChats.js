import client from "./apolloClient";
import gql from "graphql-tag";
import myAxios from "./axios-config";

<<<<<<< HEAD
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
                sinceCreation
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
=======
const GETMYCHATS = "GETMYCHATS";
const getMyChats = myChats => {
  return { type: GETMYCHATS, myChats };
};

export const fetchMyChats = uid => {
  return async dispatch => {
    try {
      const { data } = await client.query({
        query: gql`
          query {
            myChats(userId: 1) {
              id
              users {
                id
                fullName
              }
            }
          }
        `
      });

      console.log("data in thunk", data);
      dispatch(getMyChats(data.myChats));
      // const {
      //   data: {
      //     data: { myChats },
      //   },
      // } = myAxios.post('/', {
      //   query: `
      //    query{
      //        myChats(userId:${uid}){
      //            progress
      //            status
      //            id
      //            users{
      //                id
      //                fullName
      //            }
      //        }
      //    }
      //   `,
      // })
      console.log("data object in myChats", myChats);
      dispatch(getMyChats(myChats));
>>>>>>> 707a2936fde71b417132197aeb061453781a1050
    } catch (e) {
      console.error("messed up in fetchMyChats, error: ", e);
    }
  };
};

const reducer = (chats = [], action) => {
  switch (action.type) {
    case GETMYCHATS:
<<<<<<< HEAD
      return action.myChats
    case ADDCHAT:
      return [...chats, action.newChat]
    default:
      return chats
=======
      return action.myChats;

    default:
      return state;
>>>>>>> 707a2936fde71b417132197aeb061453781a1050
  }
};

export default reducer;
