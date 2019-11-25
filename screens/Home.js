import React, { Component } from 'react'
import {
  ImageBackground,
  View,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native'
import {
  Container,
  Button,
  H3,
  Icon,
  Header,
  Content,
  Left,
  Body,
  Right,
} from 'native-base'
import { Platform } from '@unimodules/core'

import { withNavigation } from 'react-navigation'
import CustomHeader from '../components/CustomHeader'

class Home extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => {
      return (
        <Icon name='home' style={{ fontSize: 24, color: tintColor }}></Icon>
      )
    },
  }
  render() {
    console.log('dsfsf', process.env.TUNNEL)
    return (
      <Container>
        <StatusBar barStyle='light-content' />
        <CustomHeader />
        <Content
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></Content>
      </Container>
    )
  }
}

export default Home
