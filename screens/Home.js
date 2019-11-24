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
  Card,
  CardItem,
} from 'native-base'
import { Platform } from '@unimodules/core'

import { withNavigation } from 'react-navigation'
import CustomHeader from '../components/CustomHeader'
import { connect } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { fetchMyChats } from '../redux/myChats'

// const Query = gql`
//   query RootQueryType {
//     allUsers {
//       id
//       email
//       fullName
//     }
//   }
// `

class Home extends Component {
  constructor() {
    super()
    this.state = {
      user: { fullName: 'Avaree Warrick', id: 1 },
    }
  }
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => {
      return (
        <Icon name='home' style={{ fontSize: 24, color: tintColor }}></Icon>
      )
    },
  }

  componentDidMount() {
    this.props.fetchMyChats(this.state.user.id)
  }

  render() {
    return (
      <Container>
        <StatusBar barStyle='light-content' />
        <CustomHeader />
        <Content
          contentContainerStyle={{
            flex: 1,
            // alignItems: 'center',
            // justifyContent: 'center',
          }}
        >
          {this.props.myChats.length ? (
            <Card>
              {this.props.myChats.map(cur => {
                return (
                  <CardItem key={cur.id}>
                    <Left>
                      <Icon name='person' />
                    </Left>
                    <Text>
                      {
                        cur.users.find(
                          user => user.fullName !== this.state.user.fullName
                        ).fullName
                      }
                    </Text>
                  </CardItem>
                )
              })}
            </Card>
          ) : (
            <Text>user has no chats</Text>
          )}
        </Content>
      </Container>
    )
  }
}

export default connect(({ myChats }) => ({ myChats }), { fetchMyChats })(Home)
