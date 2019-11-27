import React, {Component} from 'react'
import {ImageBackground, View, StatusBar, StyleSheet, Text} from 'react-native'
import {Container, Button, Icon, Content, Left, Right} from 'native-base'
import {Platform} from '@unimodules/core'

import {withNavigation} from 'react-navigation'
import CustomHeader from '../components/CustomHeader'
import {connect} from 'react-redux'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {fetchMyChats, findOrCreateChat} from '../redux/myChats'
import ActiveComp from '../components/ActiveComp'
import PendingComp from '../components/PendingComp'
import {ScrollView} from 'react-native-gesture-handler'
import {setUser} from '../redux/user'
import {fetchUserLogin} from '../redux/user'

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
    //this is just for testing
    // this.props.setUser(this.state.user)

    if (!this.props.user.id) {
      this.props.setUser(this.props.navigation.getParam('user', 'no-user'))
    }
    if (this.props.user.id) {
      this.props.fetchMyChats(this.props.user.id)
    }

    //console.log('HOME PROPS', this.props)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.user.id !== this.props.user.id) {
      this.props.fetchMyChats(this.props.user.id)
    }
  }

  render() {
    return (
      <Container>
        <ScrollView>
          <StatusBar barStyle="light-content" />
          <CustomHeader title="Home" />
          <Content
            contentContainerStyle={{
              flex: 1
            }}
          >
            {this.props.myChats.length ? (
              <>
                <ActiveComp />
                <PendingComp />
              </>
            ) : (
              <Text>user has no chats</Text>
            )}

            <Right>
              <Button
                bordered
                rounded
                info
                onPress={() => this.props.findOrCreateChat(this.props.user.id)}
              >
                <Icon name="pluscircle" type="AntDesign">
                  <Text>New Chat</Text>
                </Icon>
              </Button>
            </Right>
            <Button onPress={() => this.props.navigation.navigate('Test')}>
              <Text>login</Text>
            </Button>
          </Content>
        </ScrollView>
      </Container>
    )
  }
}

export default connect(({myChats, user}) => ({myChats, user}), {
  fetchMyChats,
  findOrCreateChat,
  setUser,
  fetchUserLogin
})(Home)
