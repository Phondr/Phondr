/* eslint-disable react/display-name */
/* eslint-disable no-undef */
import {AppLoading} from 'expo'
import {Asset} from 'expo-asset'
import * as Font from 'expo-font'
import React, {Component, useState, useEffect} from 'react'
import {Platform, StatusBar, StyleSheet, View, Text, Image} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {
  createDrawerNavigator,
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation'

import Home from './screens/Home'
import {Container, Content, Header, Body, Drawer, Icon} from 'native-base'
import drawerStyles from './styles/drawerStyle'
import CustomDrawer from './components/CustomDrawer'
import New from './components/route'
import ApolloClient from 'apollo-boost'
import {connect, Provider} from 'react-redux'
import store from './redux/store'
import AppNavigator from './navigation/AppNavigator'
import AuthPages from './navigation/MainLoginNavigator'
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
import PendingMeetings from './components/PendingMeetingComp'
import UserProfileEdit from './screens/UserProfileEdit'
import Spinner from './components/Spinner'
import MapV from './components/MapView'
import TabBarIcon from './components/TabBarIcon'
const {url} = require('./secrets')
import PlaceSearch from './components/PlaceSearch'
import MeetingModal from './screens/MeetingModal'
import ActiveMeetingScreen from './screens/ActiveMeetingScreen'
import PendingMeetingScreen from './screens/PendingMeetingScreen'

const ActiveScreenStack = createStackNavigator(
  {
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
  },
  {
    initialRouteName: 'ActiveScreen',
    navigationOptions: {
      tabBarLabel: 'Active',
      tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name={'bars'} />
    }
  }
)
const ActiveMeetingStack = createStackNavigator(
  {
    ActiveMeetingScreen: {
      screen: ActiveMeetingScreen,
      navigationOptions: {
        header: null
      }
    },
    SingleChat: {
      screen: SingleChat,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'ActiveMeetingScreen',
    navigationOptions: {
      tabBarLabel: 'Active',
      tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name={'bars'} />
    }
  }
)

const ChatBottomTab = createBottomTabNavigator(
  {
    Active: {screen: ActiveScreenStack},
    Pending: {screen: PendingScreen}
  },
  {
    tabBarOptions: {
      style: {paddingBottom: 5},
      labelStyle: {fontSize: 12},
      activeTintColor: 'orange'
    },
    navigationOptions: {
      drawerIcon: ({tintColor}) => {
        return (
          <Icon
            name="chat"
            type={'Entypo'}
            style={{fontSize: 24, color: tintColor}}
          ></Icon>
        )
      }
    }
  }
)
const MeetingBottomTab = createBottomTabNavigator(
  {
    Active: {screen: ActiveMeetingStack},
    Pending: {screen: PendingMeetingScreen}
  },
  {
    tabBarOptions: {
      style: {paddingBottom: 5},
      labelStyle: {fontSize: 12},
      activeTintColor: 'orange'
    },
    navigationOptions: {
      drawerIcon: ({tintColor}) => {
        return (
          <Icon
            name="place"
            type={'MaterialIcons'}
            style={{fontSize: 24, color: tintColor}}
          ></Icon>
        )
      }
    }
  }
)

var drawer = createDrawerNavigator(
  {
    Profile: {
      screen: Profile
    },
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
    Chats: {
      screen: ChatBottomTab
    },
    Meetings: {
      screen: MeetingBottomTab
    },
    'Sign Out': {
      screen: SignOut
    },
    UserProfileEdit: {
      screen: UserProfileEdit
    }
    // MeetingModal: {}
  },
  {
    initialRouteName: 'Entry',
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
