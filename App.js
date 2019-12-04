/* eslint-disable no-undef */
import {AppLoading} from 'expo'
import {Asset} from 'expo-asset'
import * as Font from 'expo-font'
import React, {Component, useState, useEffect} from 'react'
import {Platform, StatusBar, StyleSheet, View} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {
  createDrawerNavigator,
  createAppContainer,
  createStackNavigator
} from 'react-navigation'
import Home from './screens/Home'
import CustomDrawer from './components/CustomDrawer'
import New from './components/route'
import ApolloClient from 'apollo-boost'
import {connect, Provider} from 'react-redux'
import store from './redux/store'
import Login from './screens/Login'
import FlashMessage from 'react-native-flash-message'
import Signup from './screens/Signup'
import Entry from './screens/Entry'
import SignOut from './screens/SignOut'
import PendingScreen from './screens/PendingScreen'
import ActiveScreen from './screens/ActiveScreen'
import SingleChat from './components/SingleChat'
import ActiveComponent from './components/ActiveComp'
import {AsyncStorage} from 'react-native'
import {getData} from './redux/user'
import Profile from './screens/Profile'
import PendingMeetings from './screens/PendingMeetings'
import UserProfileEdit from './screens/UserProfileEdit'
import Spinner from './components/Spinner'
import MapV from './components/MapView'

const {url} = require('./secrets')
import PlaceSearch from './components/PlaceSearch'
import MeetingModal from './screens/MeetingModal'

const ActiveScreenStack = createStackNavigator({
  ActiveScreen: {
    screen: ActiveScreen,
    navigationOptions: {
      header: null
    }
  },
  SingleChat: {
    screen: SingleChat,
    navigationOptions: {
      header: null
    }
  },
  MeetingModal: {
    screen: MeetingModal,
    navigationOptions: {
      header: null
    }
  }
})

var drawer = createDrawerNavigator(
  {
    Profile: {
      screen: Profile
    },
    Home: {
      screen: Home
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
    MapV: {
      screen: MapV
    },
    'Pending Chats': {
      screen: PendingScreen
    },
    'Pending Meetings': {
      screen: PendingMeetings
    },
    'Active Chats': {
      screen: ActiveScreenStack
    },
    'Sign Out': {
      screen: SignOut
    },
    UserProfileEdit: {
      screen: UserProfileEdit
    },
    MeetingModal: {
      screen: MeetingModal
    }
  },
  {
    initialRouteName: 'Entry',
    contentComponent: CustomDrawer,

    contentOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'white',
      activeBackgroundColor:'#FF91AF',
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
          <DrawerContainer />
          <FlashMessage position="top" />
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
