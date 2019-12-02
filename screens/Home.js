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
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton
} from 'react-native-popup-dialog'

class Home extends Component {
  constructor() {
    super()
    this.state = {
      user: {fullName: 'Avaree Warrick', id: 1, isNoob: true},
      defaultAnimationDialog: true
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

    console.log('home mounted')
    console.log(this.props.user)
    this.props.fetchMyChats(this.props.user.id)

    //console.log('HOME PROPS', this.props)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.user.id !== this.props.user.id) {
      this.props.fetchMyChats(this.props.user.id)
    }
  }

  render() {
    return (
      <Container style={{backgroundColor: '#343434'}}>
        <ScrollView>
          {this.state.user.isNoob === true ? (
            <Dialog
              onDismiss={() => {
                this.setState({defaultAnimationDialog: false})
              }}
              width={0.9}
              visible={this.state.defaultAnimationDialog}
              rounded
              actionsBordered
              dialogTitle={
                <DialogTitle
                  title="Intro to the App"
                  style={{
                    backgroundColor: '#F7F7F8'
                  }}
                  hasTitleBar={false}
                  align="left"
                />
              }
              footer={
                <DialogFooter>
                  <DialogButton
                    text="Turn off intro"
                    bordered
                    onPress={() => {
                      this.setState({
                        defaultAnimationDialog: false,
                        isNoob: false
                      })
                    }}
                    key="button-1"
                  />
                  <DialogButton
                    text="OK"
                    bordered
                    onPress={() => {
                      this.setState({defaultAnimationDialog: false})
                    }}
                    key="button-2"
                  />
                </DialogFooter>
              }
            >
              <DialogContent
                style={{
                  backgroundColor: '#F7F7F8'
                }}
              >
                <Text>INPUT THE INTRO HERE</Text>
              </DialogContent>
            </Dialog>
          ) : null}

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
                onPress={() => this.props.findOrCreateChat(1)}
              >
                <Icon name="pluscircle" type="AntDesign">
                  <Text> New Chat</Text>
                </Icon>
              </Button>
            </Right>
          </Content>
        </ScrollView>
      </Container>
    )
  }
}

export default connect(({myChats, user}) => ({myChats, user}), {
  fetchMyChats,
  findOrCreateChat,
  setUser
})(Home)
