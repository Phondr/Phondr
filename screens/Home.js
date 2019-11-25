import React, {Component} from 'react'
import {ImageBackground, View, StatusBar, StyleSheet, Text} from 'react-native'
<<<<<<< HEAD
import {Container, Button, Icon, Content, Left, Right} from 'native-base'
=======
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
  CardItem
} from 'native-base'
>>>>>>> 707a2936fde71b417132197aeb061453781a1050
import {Platform} from '@unimodules/core'

import {withNavigation} from 'react-navigation'
import CustomHeader from '../components/CustomHeader'
import {connect} from 'react-redux'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'
<<<<<<< HEAD
import {fetchMyChats, findOrCreateChat} from '../redux/myChats'
import ActiveChats from '../components/ActiveChats'
import PendingChats from '../components/PendingChats'
import {ScrollView} from 'react-native-gesture-handler'
=======
// import {fetchMyChats} from '../redux/myChats'

// const Query = gql`
//   query RootQueryType {
//     allUsers {
//       id
//       email
//       fullName
//     }
//   }
// `
>>>>>>> 707a2936fde71b417132197aeb061453781a1050

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
<<<<<<< HEAD
    this.props.fetchMyChats(1)
    console.log('home mounted')
=======
    //this.props.fetchMyChats(this.state.user.id)
>>>>>>> 707a2936fde71b417132197aeb061453781a1050
  }

  render() {
    return (
      <Container>
<<<<<<< HEAD
        <ScrollView>
          <StatusBar barStyle="light-content" />
          <CustomHeader />
          <Content
            contentContainerStyle={{
              flex: 1
            }}
          >
            {this.props.myChats.length ? (
              <>
                <ActiveChats user={this.state.user} />
                <PendingChats user={this.state.user} />
              </>
            ) : (
              <Text>user has no chats</Text>
            )}

            <Right>
              <Button
                bordered
                rounded
                info
                onPress={() => this.props.findOrCreateChat(1)}
              >
                <Icon name="pluscircle" type="AntDesign">
                  <Text>New Chat</Text>
                </Icon>
              </Button>
            </Right>
          </Content>
        </ScrollView>
=======
        <StatusBar barStyle="light-content" />
        <CustomHeader />
        <Content
          contentContainerStyle={{
            flex: 1
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
                      <Icon name="person" />
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
>>>>>>> 707a2936fde71b417132197aeb061453781a1050
      </Container>
    )
  }
}

<<<<<<< HEAD
export default connect(({myChats, user}) => ({myChats, user}), {
  fetchMyChats,
  findOrCreateChat
})(Home)
=======
export default connect(({myChats}) => ({myChats}))(Home)
// export default connect(({myChats}) => ({myChats}), {fetchMyChats})(Home)
>>>>>>> 707a2936fde71b417132197aeb061453781a1050
