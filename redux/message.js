import client from './apolloClient';
import gql from 'graphql-tag';
import axios from 'axios';
import { url } from '../secrets';

const GET_MESSAGES = 'GET_MESSAGES';
const NEW_MESSAGE = 'NEW_MESSAGE';

const getMessages = messages => {
  return { type: GET_MESSAGES, messages };
};
export const setNewMessage = message => {
  return { type: NEW_MESSAGE, message };
};

export const fetchMessages = chatId => {
  return async dispatch => {
    try { //Add in user{avatar: profilePicture} when they unlock this to show profile picture in chat instead of initials
      const { data } = await axios({
        url: url + '/graphql',
        method: 'POST',
        data: {
          query: `
          {
            messages(chatId: ${chatId}) {
              _id: id,
              text: content,
              length,
              createdAt,
              userId,
              chatId,
              user {
                _id: id,
                name: fullName,
                email,
              }
            }
          }
          `,
        },
      });
      const formatedMessage = data.data.messages.map(message => {
        message.createdAt = new Date(Number(message.createdAt));
        return message;
      });
      // console.log('data in thunk', formatedMessage);
      dispatch(getMessages(formatedMessage));
    } catch (e) {
      console.error('messed up in fetchMyChats, error: ', e);
    }
  };
};

export const newMessage = message => {
  return async dispatch => {
    try {
      const { data } = await axios.post(url + '/graphql', {
        query: `
          mutation{
            newMessage(content: "${message.content}", length: ${message.length}, userId: ${message.userId}, chatId: ${message.chatId}) {
              _id: id,
              text: content,
              createdAt,
              length,
              userId,
              chatId,
              user {
                _id: id,
                email,
                name: fullName,
              }
            }
          }
          `,
      });
      //Format into readable date by gifted chat
      data.data.newMessage.createdAt = new Date(Number(data.data.newMessage.createdAt))
      // await dispatch(setNewMessage(data.data.newMessage));
      return data.data.newMessage
    } catch (e) {
      console.error('messed up in fetchMyChats, error: ', e);
    }
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return action.messages;
    case NEW_MESSAGE:
      return [action.message, ...state];
    default:
      return state;
  }
};

export default reducer;
