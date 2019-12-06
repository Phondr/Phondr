import axios from 'axios'
const {url} = require('../secrets')
import gql from 'graphql-tag'
import {AsyncStorage} from 'react-native'
import AsyncUtils from '../server/AsyncUtils'
import client from './apolloClient'
import myAxios from './axios-config'
import {RNS3} from 'react-native-s3-upload'
const {amazonImageConfig} = require('../secrets')

require('../secrets')

// const cloudurl = CLOUDINARY_URL
// cloudinary.config({
//   cloud_name: cloudinaryName,
//   api_key: cloudinaryAPIkey,
//   api_secret: cloudinarySecret
// })

//action type
const GETUSER = 'GETUSER'
const ADDUSER = 'ADDUSER'
const EDITUSER = 'EDITUSER'
const UPDATENOOB = 'UPDATENOOB'

//action creator
export const setUser = user => ({type: GETUSER, user})
export const editUser = user => ({type: EDITUSER, user})
export const addUser = user => ({type: ADDUSER, user})
export const updateN = user => ({type: UPDATENOOB, user})

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
    const email = values.email.toLowerCase()
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
              iAm
              iPrefer
              distPref
              isNoob
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

export const userSignUp = (
  values,
  preferences,
  address,
  photo
) => async dispatch => {
  try {
    if (getData('userKey')) {
      removeData('userKey')
    }

    const fullName = values.name
    const age = values.age
    const password = values.password
    const email = values.email
    const distPref = values.radius
    const iPrefer = preferences
    const iAm = values.gender
    const profilePicture = photo
    const homeLocation = address

    //console.log('SIGNUP STUFF', values, iPrefer, homeLocation, photo)

    RNS3.put(
      {
        uri: profilePicture,
        name: email + 'profile_image.jpg',
        type: 'image/jpg'
      },
      amazonImageConfig
    ).then(async response => {
      if (response.status !== 201) {
        throw new Error('Failed to upload image to S3')
      }
      //console.log('RESPONSE BODY', response.body)
      /**
       * {
       *   postResponse: {
       *     bucket: "your-bucket",
       *     etag : "9f620878e06d28774406017480a59fd4",
       *     key: "uploads/image.png",
       *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
       *   }
       * }
       */
      let {data} = await axios.post(`${url}/graphql`, {
        query: `mutation{
          userSignup(fullName: "${fullName}", email: "${email}", iAm: "${iAm}", age: ${age}, distPref: ${distPref}, homeLocation: [${homeLocation.map(
          i => `${i}`
        )}], iPrefer: [${iPrefer.map(
          i => `"${i}"`
        )}], password: "${password}", profilePicture: "${
          response.headers.Location
        }" ) {
            id
            email
            fullName
            homeLocation
            incentivePoints
            profilePicture
            age
            iAm
            iPrefer
            isNoob
            }
                }`
      })

      if (data.data.userSignup) {
        storeData('userKey', JSON.stringify(data.data.userSignup))
      }

      dispatch(setUser(data.data.userSignup))
    })
  } catch (error) {
    alert('COULD NOT SIGN-UP')
    console.log(error)
  }
}

export const fetchUserFromAsync = () => async dispatch => {
  try {
    console.log('user before parse', await getData('userKey'))
    const user = JSON.parse(await getData('userKey'))
    console.log('user after parse', user)
    let {data} = await axios.post(`${url}/graphql`, {
      query: `{
        user(id: ${user.id}) {
          id
          email
          fullName
          homeLocation
          incentivePoints
          profilePicture
          age
          iAm
          iPrefer
          isNoob
          
        }
              }`
    })

    if (data.data.user) {
      dispatch(setUser(data.data.user))
    }
  } catch (error) {
    alert('COULD NOT GET PROFILE DATA, fetch user from async')
    console.log(error)
  }
}

export const fetchUserFromUserId = userid => async dispatch => {
  try {
    let {data} = await axios.post(`${url}/graphql`, {
      query: `{
           user(id: ${userid}) {
              id
              email
              fullName
              homeLocation
              incentivePoints
              profilePicture
              age
              iAm
              iPrefer
              isNoob
            }
                  }`
    })

    if (data.data.user) {
      dispatch(setUser(data.data.user))
    }
  } catch (error) {
    alert('COULD NOT GET PROFILE DATA,fetch user from user id')
    console.log(error)
  }
}

export const EditUser = (user, userId) => async dispatch => {
  try {
    //OVERWRITE KEY
    if (getData('userKey')) {
      console.log('REMOVED KEY')
      removeData('userKey')
    }

    let {data} = await client.mutate({
      mutation: gql`mutation{
        editUser(id: ${userId}, email: "${user.email}", fullName: "${user.fullName}", iAm: "${user.iAm}"
      ) {
          id
          email
          fullName
          homeLocation
          incentivePoints
          profilePicture
          age
          iAm
          iPrefer
          isNoob
          
        }
              }`
    })

    //update User key async storage

    if (data.editUser) {
      storeData('userKey', JSON.stringify(data.editUser))
      //dispatch(editUser(data.user))
    }

    if (data.editUser) {
      dispatch(setUser(data.editUser))
    }
  } catch (error) {
    alert('COULD NOT GET PROFILE DATA, edit user')
    console.log(error)
  }
}

export const ConvertUser = () => async dispatch => {
  try {
    //OVERWRITE KEY

    const user = JSON.parse(await getData('userKey'))
    const falseguy = false

    let {data} = await client.mutate({
      mutation: gql`mutation{
        updateNoob(id: ${user.id}) {
        id
        email
        fullName
        homeLocation
        incentivePoints
        profilePicture
        age
        iAm
        iPrefer
        isNoob
        }
              }`
    })

    //update User key async storage

    if (data.updateNoob) {
      removeData('userKey')
      storeData('userKey', JSON.stringify(data.updateNoob))
      //dispatch(editUser(data.user))
    }

    if (data.updateNoob) {
      dispatch(updateN(data.updateNoob))
    }
  } catch (error) {
    alert('COULD NOT GET PROFILE DATA, convert user')
    console.log(error)
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GETUSER:
      return action.user
    case ADDUSER:
      return action.user
    case EDITUSER:
      return action.user
    case UPDATENOOB:
      return action.user
    default:
      return state
  }
}
