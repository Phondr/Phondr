import axios from 'axios'
const {url} = require('../secrets')
import gql from 'graphql-tag'
import {AsyncStorage} from 'react-native'
import AsyncUtils from '../server/AsyncUtils'
import client from './apolloClient'
import myAxios from './axios-config'

//action type
const GETUSER = 'GETUSER'
const ADDUSER = 'ADDUSER'

//action creator
export const setUser = user => ({type: GETUSER, user})
export const addUser = user => ({type: ADDUSER, user})

//state
const initialState = {}

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
    const data = await getData(key)
  } catch (e) {
    // saving error
    console.log(e)
  }
}

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value) {
      // value previously stored
      console.log('MADE KEY')
      return value
    }
  } catch (e) {
    // error reading value
    console.log(e)
  }
}

export const removeData = async key => {
  try {
    await AsyncStorage.removeItem(key)
    console.log('REMOVED KEY')
  } catch (e) {
    // error reading value
    console.log(e)
  }
}

//thunk
export const fetchUserLogin = values => async dispatch => {
  try {
    const email = values.email
    const password = values.password

    if (getData('userKey')) {
      removeData('userKey')
    }

    let {data} = await axios({
      url: `${url}/graphql`,
      method: 'POST',
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
    })

    if (data.data.userLogin) {
      //console.log('USERLOGIN', data.data.userLogin.email)
      storeData('userKey', JSON.stringify(data.data.userLogin))
    }

    dispatch(setUser(data.data.userLogin))
  } catch (error) {
    alert('COULD NOT LOGIN')
    console.log(error)
  }
}

export const userSignUp = (values, preferences) => async dispatch => {
  try {
    console.log(values, preferences)

    if (getData('userKey')) {
      removeData('userKey')
    }

    const fullName = values.fullName
    const age = values.age
    const password = values.password
    const email = values.email
    const address = values.address
    const radius = values.radius

    let {data} = await client.mutate({
      mutation: gql`mutation{
        userSignup(fullName: "${fullName}", email: "${email}", password: "${password}") {
          id
          email
          fullName
          password
          }
              }`
    })

    if (data.userSignup) {
      storeData('userKey', JSON.stringify(data.userSignup))
    }

    dispatch(setUser(data.userSignup))
  } catch (error) {
    alert('COULD NOT SIGN-UP')
    console.log(error)
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GETUSER:
      return action.user
    case ADDUSER:
      return action.user
    default:
      return state
  }
}
