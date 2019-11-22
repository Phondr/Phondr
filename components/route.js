import {
  createAppContainer,
  createStackNavigator,
  withNavigation,
} from 'react-navigation'
import React from 'react'
<<<<<<< HEAD
import {View, Text, Button} from 'native-base'
=======
import {
  View,
  Text,
  Button,
  Icon,
  Header,
  Left,
  Right,
  Body,
} from 'native-base'
import { StyleSheet } from 'react-native'
>>>>>>> dbcf5d100740f15902fc9349a5d3bf9e9cfebfce
import AllChats from './Allchat'
import Profile from './Profile'
import MapView from './MapView'
import Meetview from './Meetview'
import Sendmeetings from './Sendmeeting'
import SingleChats from './SingleChat'
<<<<<<< HEAD
class Stack extends React.Component {
  render() {
    return (
      <View>
=======
import { Platform } from '@unimodules/core'
class Stack extends React.Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => {
      return (
        <Icon name='home' style={{ fontSize: 24, color: tintColor }}></Icon>
      )
    },
  }
  render() {
    return (
      <View>
        <Header style={styles.header}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name='menu' />
            </Button>
          </Left>
          <Body />
          <Right />
        </Header>
>>>>>>> dbcf5d100740f15902fc9349a5d3bf9e9cfebfce
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
          <Text>sendmeeting</Text>
        </Button>
        <Button
          onPress={() => {
            this.props.navigation.navigate('singlechat')
          }}
        >
          <Text>singlechat</Text>
        </Button>
      </View>
    )
  }
}
<<<<<<< HEAD
const Temp = createStackNavigator({
  stack: {
    screen: Stack
  },
  allchat: {
    screen: AllChats
  },
  profile: {
    screen: Profile
  },
  mapview: {
    screen: MapView
  },
  meetview: {
    screen: Meetview
  },
  sendmeeting: {
    screen: Sendmeetings
  },
  singlechat: {
    screen: SingleChats
  }
=======
const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS !== 'ios' ? 15 : 0,
    justifyContent: 'flex-end',
  },
>>>>>>> dbcf5d100740f15902fc9349a5d3bf9e9cfebfce
})
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
      screen: MapView,
    },
    meetview: {
      screen: Meetview,
    },
    sendmeeting: {
      screen: Sendmeetings,
    },
    singlechat: {
      screen: SingleChats,
    },
  },
  { initialRouteName: 'stack' }
)
export const New = createAppContainer(Temp)
