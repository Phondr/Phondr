import React, {Component} from 'react'
import {ImageBackground, View, StatusBar, StyleSheet, Text} from 'react-native'
import {Container, Button, Icon, Content, Left} from 'native-base'
import {Platform} from '@unimodules/core'

import {withNavigation} from 'react-navigation'
import CustomHeader from '../components/CustomHeader'
import {connect} from 'react-redux'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {fetchMyChats, findOrCreateChat} from '../redux/myChats'
import ActiveChats from '../components/ActiveChats'

class Home extends Component {
  constructor() {
    super()
    this.state = {
      user: {fullName: 'Avaree Warrick', id: 1}
    }
  }
  static navigationOptions = {
    drawerIcon: ({tintColor}) => {
      return <Icon name="home" style={{fontSize: 24, color: tintColor}}></Icon>
    }
  }

  componentDidMount() {
    this.props.fetchMyChats(this.state.user.id)
  }

  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <CustomHeader />
        <Content
          contentContainerStyle={{
            flex: 1
          }}
        >
          {this.props.myChats.length ? (
            <ActiveChats user={this.state.user} />
          ) : (
            <Text>user has no chats</Text>
          )}

          <Button onPress={() => this.props.findOrCreateChat(1)}>
            <Left>
              <Icon color="blue" name="pluscircle" type="AntDesign" />
            </Left>
            <Text>New Chat</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}

export default connect(({myChats, user}) => ({myChats, user}), {
  fetchMyChats,
  findOrCreateChat
})(Home)
