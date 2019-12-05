import React from 'react'
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from 'react-navigation'
import {Platform} from 'react-native'
import Login from '../screens/Login'
import Signup from '../screens/Signup'
import SignupMapView from '../screens/SignupMapView'
import Entry from '../screens/Entry'

const config = Platform.select({
  web: {headerMode: 'screen'},
  default: {}
})

const EntryStack = createStackNavigator(
  {
    Entry: Entry,
    Login: Login,
    Signup: Signup
  },
  {
    initialRouteName: 'Entry'
  },
  {
    navigationOptions: {
      gesturesEnabled: true
    }
  }
)

export default EntryStack
