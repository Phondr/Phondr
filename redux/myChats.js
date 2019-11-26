import client from './apolloClient';
import gql from 'graphql-tag';

const GETMYCHATS = 'GETMYCHATS';
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
        `,
      });
      // console.log('data in thunk', data);
      dispatch(getMyChats(data.myChats));
    } catch (e) {
      console.error('messed up in fetchMyChats, error: ', e);
    }
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case GETMYCHATS:
      return action.myChats;
    default:
      return state;
  }
};

export default reducer;
