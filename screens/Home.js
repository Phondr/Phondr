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
import { connect } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const Query = gql`
  query RootQueryType {
    allUsers {
      id
      email
      fullName
    }
  }
`

class Home extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => {
      return (
        <Icon name='home' style={{ fontSize: 24, color: tintColor }}></Icon>
      )
    },
  }
  render() {
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
