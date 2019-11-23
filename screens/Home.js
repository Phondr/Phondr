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
<<<<<<< HEAD
    console.log('dsfsf', process.env.TUNNEL)
=======
    const { data } = useQuery(Query)
    console.log('data', data)
>>>>>>> b1e6434051f2522f2dc339a1d7b9fbcd7d5607c4
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
