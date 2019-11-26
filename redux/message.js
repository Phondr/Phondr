import client from './apolloClient';
import gql from 'graphql-tag';
import axios from 'axios';

//Action
const GET_MESSAGES = 'GET_MESSAGES';
const NEW_MESSAGE = 'NEW_MESSAGE';

//Action Creator
const getMessages = messages => {
  return { type: GET_MESSAGES, messages };
};
const getNewMessage = message => {
  return { type: NEW_MESSAGE, message };
};

export const fetchMessages = chatId => {
  return async dispatch => {
    try {
      // const { data } = await client.query({
      //   query: gql`
      //     query {
      //       messages(chatId: ${chatId}) {
      //         _id: id,
      //         text: content,
      //         length,
      //         createdAt,
      //         userId,
      //         chatId,
      //         user {
      //           _id: id,
      //           email,
      //         }
      //       }
      //     }
      //   `,
      // });
      let {data} = await axios({
        url: 'https://741ec670.ngrok.io/graphql',
        method: 'POST',
        data: {
          query: `
          {
            messages(chatId: ${chatId}) {
              _id: id, 
              content,
              text: content,
              length,
              createdAt,
              userId,
              chatId, 
              user {
                _id: id,
                email,
              }
            }
          }
          `
        }
      })
      //Convert timestamp string into a number and then a readable date for usage within Gifted Chat
      const formattedMessages = data.data.messages.map(message=>{message.createdAt = new Date(Number(message.createdAt)); return message})
      dispatch(getMessages(formattedMessages));
    } catch (e) {
      console.error('messed up in fetchMessages, error: ', e);
    }
  };
};

export const newMessage = (message) => {
  return async dispatch => {
    try {
      const { data } = await client.mutate({
        mutation: gql`
          mutation {
            newMessage(content: "${message.content}", length: ${message.length}, chatId: ${message.chatId}, userId: ${message.userId}) {
              _id: id
              content
              length
              userId
              chatId
              user {
                _id: id,
                email,
              }
            }
          }
        `,
      });
      // console.log('dsfdsfdsfdsfds', data.newMessage)
      dispatch(getNewMessage(data.newMessage))
    } catch (err) {
      console.error(err);
    }
  };
};

const reducer = (state = [], action) => {
  console.log(action)
  switch (action.type) {
    case GET_MESSAGES:
      return action.messages;
    case NEW_MESSAGE:
      return [...state, action.message];
    default:
      return state;
  }
};

export default reducer;
