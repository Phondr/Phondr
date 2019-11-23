import axios from "axios";

const { url } = require("../../secrets");
console.log("URL", url);

//action type
const GETUSER = "GETUSER";
const ADDUSER = "ADDUSER";

//action creator
export const setUser = user => ({ type: GETUSER, user });
export const addUser = user => ({ type: ADDUSER, user });

//state
const initialState = {};

//thunk
export const fetchUserLogin = values => async dispatch => {
  try {
    const email = values.email;
    const password = values.password;
    let { data } = await axios({
      url: `${url}/graphql`,
      method: "POST",
      data: {
        query: `
        {
          userLogin(email: "${email}", password: "${password}") {
              id
              email
              fullName
              homeLocation
              incentivePoints
              profilePicture
            }
        }
        `
      }
    });
    dispatch(setUser(data));
  } catch (error) {
    alert("COULD NOT LOGIN");
    console.log(error);
  }
};

export const userSignUp = values => async dispatch => {
  try {
    const fullname = values.fullname;
    const age = values.age;
    const password = values.password;

    let { data } = await axios({
      url: `${url}/graphql`,
      method: "POST",
      data: {
        query: `
        {
          userSignup(email: "${email}", password: "${password}",  fullname: "${fullname}",  age: "${age}") {
            id
            }
        }
        `
      }
    });
    console.log("DATA", data);
    dispatch(setUser(data));
  } catch (error) {
    alert("COULD NOT SIGN-UP");
    console.log(error);
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GETUSER:
      return action.user;
    case ADDUSER:
      return action.user;
    default:
      return state;
  }
};
