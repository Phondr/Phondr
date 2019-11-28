/* eslint-disable no-undef */
import {AppLoading} from 'expo'
import {Asset} from 'expo-asset'
import * as Font from 'expo-font'
import React, {Component, useState, useEffect} from 'react'
import {Platform, StatusBar, StyleSheet, View, Text, Image} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {createDrawerNavigator, createAppContainer} from 'react-navigation'
import Home from './screens/Home'
import {Container, Content, Header, Body, Drawer} from 'native-base'
import drawerStyles from './styles/drawerStyle'
import CustomDrawer from './components/CustomDrawer'
import AnatomyExample from './components/hellowworld'
import New from './components/route'
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from '@apollo/react-hooks'
import {connect, Provider} from 'react-redux'
import store from './redux/store'
import AppNavigator from './navigation/AppNavigator'
import AuthPages from './navigation/MainLoginNavigator'
import Login from './screens/Login'
import FlashMessage from 'react-native-flash-message'
import Signup from './screens/Signup'
import Entry from './screens/Entry'
import PendingScreen from './screens/PendingScreen'
import ActiveScreen from './screens/ActiveScreen'
import SingleChat from './components/SingleChat'
import {AsyncStorage} from 'react-native'
import {getData} from './redux/user'
import Spinner from './components/Spinner'
const {url} = require('./secrets')
import PlaceSearch from './components/PlaceSearch'

var drawer = createDrawerNavigator(
  {
    Home: {
      screen: Home
    },
    New: {
      screen: New
    },
    Login: {
      screen: Login
    },
    Signup: {
      screen: Signup
    },
    Entry: {
      screen: Entry
    },
    SingleChat: {
      screen: SingleChat
    },
    'Pending Chats': {
      screen: PendingScreen
    },
    'Active Chats': {
      screen: ActiveScreen
    },
    PlaceSearch
  },
  {
    initialRouteName: 'PlaceSearch',
    contentComponent: CustomDrawer,
    contentOptions: {
      activeTintColor: 'orange'
    },
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle'
  }
)

const DrawerContainer = createAppContainer(drawer)

function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false)
  const [apClient, setApClient] = useState({})
  const [getData, setGetData] = useState({})

  useEffect(() => {
    setApClient(
      new ApolloClient({
        uri: url + '/graphql'
      })
    )
  }, [])

  if ((!isLoadingComplete && !props.skipLoadingScreen) || !apClient) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    )
  } else {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {/* <AppNavigator /> */}
          {/* <AnatomyExample /> */}
          {/* <AuthPages /> */}
          <DrawerContainer />
          <FlashMessage position="top" />
          {/* <New /> */}
        </View>
      </Provider>
    )
  }
}
export default App

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png')
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
    })
  ])
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error)
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})
