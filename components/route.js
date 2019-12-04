import {
  createAppContainer,
  createStackNavigator,
} from 'react-navigation'
import React from 'react'
import {
  View,
  Text,
  Button,
  Icon,
} from 'native-base'
import { StyleSheet, StatusBar } from 'react-native'
import Profile from './Profile'
import Mapv from './MapView'
import SingleChats from './SingleChat'
import MeetingModal from '../screens/MeetingModal'

class Stack extends React.Component {
  render() {
    return (
      <View>
        <Button
          onPress={() => {
            this.props.navigation.navigate('mapview')
          }}
        >
          <Text>mapview</Text>
        </Button>
        <Button
          onPress={() => {
            this.props.navigation.navigate('meetview')
          }}
        >
          <Text>singlechat</Text>
        </Button>
        <Button
          onPress={() => {
            this.props.navigation.navigate('MeetingModal')
          }}
        >
          <Text>meetingmodal</Text>
        </Button>
      </View>
    )
  }
}

const Temp = createStackNavigator(
  {
    stack: {
      screen: Stack
    },
    profile: {
      screen: Profile
    },
    mapview: {
      screen: Mapv
    },
    singlechat: {
      screen: SingleChats
    },
    MeetingModal
  },
  {initialRouteName: 'stack'}
)
const StackContainer = createAppContainer(Temp)
//export default StackContainer
class New extends React.Component {
  static navigationOptions = {
    drawerIcon: ({tintColor}) => {
      return <Icon name="home" style={{fontSize: 24, color: tintColor}}></Icon>
    }
  }
  render() {
    return (
      <>
        <StackContainer />
      </>
    )
  }
}
export default New
