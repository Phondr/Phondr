import {
  createAppContainer,
  createStackNavigator,
  withNavigation,
} from 'react-navigation'
import React from 'react'
import {
  View,
  Text,
  Button,
  Icon,
} from 'native-base'
import AllChats from './Allchat'
import Profile from './Profile'
import Mapv from './MapView'
import Meetview from './Meetview'
import SingleChats from './SingleChat'
import CustomHeader from '../components/CustomHeader'

class Stack extends React.Component {
  render() {
    return (
      <View>
        <Button
          onPress={() => {
            this.props.navigation.navigate('allchat')
          }}
        >
          <Text>allchat</Text>
        </Button>
        <Button
          onPress={() => {
            this.props.navigation.navigate('profile')
          }}
        >
          <Text>profile</Text>
        </Button>
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
          <Text>meetview</Text>
        </Button>
        <Button
          onPress={() => {
            this.props.navigation.navigate('sendmeeting')
          }}
        >
          <Text>singlechat</Text>
        </Button>
      </View>
    )
  }
}

const Temp = createStackNavigator(
  {
    stack: {
      screen: Stack,
    },
    allchat: {
      screen: AllChats,
    },
    profile: {
      screen: Profile,
    },
    mapview: {
      screen: Mapv,
    },
    meetview: {
      screen: Meetview,
    },
    singlechat: {
      screen: SingleChats,
    }
  },
  { initialRouteName: 'stack' }
)
const StackContainer = createAppContainer(Temp)
//export default StackContainer
class New extends React.Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => {
      return (
        <Icon name='home' style={{ fontSize: 24, color: tintColor }}></Icon>
      )
    },
  }
  render() {
    return (
      <>
        {/* <CustomHeader /> */}
        <StackContainer />
      </>
    )
  }
}
export default New
