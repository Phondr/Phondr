import axios from 'axios'
const {url} = require('../secrets')
import gql from 'graphql-tag'
import {AsyncStorage} from 'react-native'
import AsyncUtils from '../server/AsyncUtils'
console.log('URL', url)

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
    console.log('DATA', data)
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
      return value
    }
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

    dispatch(setUser(data))
  } catch (error) {
    alert('COULD NOT LOGIN')
    console.log(error)
  }
}

export const userSignUp = (values, preferences) => async dispatch => {
  try {
    console.log(values, preferences)

    const fullName = values.fullName
    const age = values.age
    const password = values.password
    const email = values.email
    const address = values.address
    const radius = values.radius

    let {data} = await axios({
      url: `${url}/graphql`,
      method: 'POST',
      data: {
        query: `
        {
          userSignup(fullName: "${fullName}", age: "${age}", homeLocation: "${address}", radius: "${radius}", email: "${email}", password: "${password}") {
            id
            email
            fullName
            }
        }
        `
      }
    })
    dispatch(setUser(data.data.userSignup))
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
