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
import {setUser, ConvertUser} from '../redux/user'
import {fetchUserLogin, fetchUserFromAsync} from '../redux/user'
import {setLoading} from '../redux/loading'
import Loading from './Loading'
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton
} from 'react-native-popup-dialog'
import Spinner from '../components/Spinner'
import socket from '../redux/socketClient'
import {showMessage} from 'react-native-flash-message'

class Home extends Component {
  constructor() {
    super()
    this.state = {
      user: {fullName: 'Avaree Warrick', id: 1, isNoob: true},
      defaultAnimationDialog: true,
      loading: true
    }
  }
  static navigationOptions = {
    drawerIcon: ({tintColor}) => {
      return <Icon name="home" style={{fontSize: 24, color: tintColor}}></Icon>
    }
  }

  // componentDidMount() {
  //this is just for testing
  // this.props.setUser(this.state.user)

  // if (!this.props.user.id) {
  //   this.props.setUser(this.props.navigation.getParam('user', 'no-user'))
  // }
  // if (this.props.user.id) {
  //   console.log('in comp did mouth fmc')
  async componentDidMount() {
    this.setState({loading: true})
    if (this.props.user.id) {
      //If brought from login screen, there is already user data on redux. Just grab chats.
      console.log('props.user.id', this.props.user.id)
      await this.props.fetchMyChats(this.props.user.id)
      this.setState({loading: false})
    }
    socket.emit('subscribe-to-user-room', {name: this.props.user.fullName}) //Subscribe to a room revolving around their name(notifications for new name and change pending chats to active)
    socket.on('receiveNewChat', () => {
      //Refetch chats to make a pending chat to active when other user matches into their chat.
      this.props.fetchMyChats(this.props.user.id)
    })
    socket.on('receiveNewMessageNotification', ({message}) => {
      showMessage({message, type: 'info', duration: 4000, icon: 'info'})
    })
    //console.log('HOME PROPS', this.props)
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.user.id !== this.props.user.id && this.props.user.id) {
      console.log('in comp did update fmc')
      await this.props.fetchMyChats(this.props.user.id)
      try {
        await this.props.fetchUserFromAsync()
      } catch (error) {
        alert('COULD NOT GET USER AFTER EDITING')
        console.log(error)
      }
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.spinner}>
          <Spinner />
        </View>
      )
    }

    const user = this.props.user || {}
    // console.log('HOME USER', user)
    if (this.state.loading) {
      return <Spinner />
    }
    return (
      <Container style={{backgroundColor: '#343434'}}>
        <ScrollView>
          {this.props.user.isNoob === true ? (
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
                  title="Welcome to Phondr!"
                  style={{
                    backgroundColor: '#F7F7F8'
                  }}
                  hasTitleBar={false}
                  align="center"
                />
              }
              footer={
                <DialogFooter>
                  <DialogButton
                    text="OK"
                    bordered
                    onPress={async () => {
                      this.setState({
                        defaultAnimationDialog: false,
                        isNoob: false
                      })
                      await this.props.ConvertUser()
                    }}
                    key="button-1"
                  />
                  <DialogButton
                    text="Cancel"
                    bordered
                    onPress={() => {
                      this.setState({
                        defaultAnimationDialog: false,
                        isNoob: false
                      })
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
                <ScrollView>
                  <Text>
                    Phondr is your one stop shop for anonymous dating/pen
                    paling! Through Phondr you will be able to chat with random
                    people(within your preferences) within your city's
                    proximity, and see your phondr bar go up within your chat.
                    At 25%, 50%, 75%, and 100% you unlock special rewards
                    relating to your chat! At 100% you get the opportunity to
                    meet with your affiliated chat member!
                    {'\n'}
                    {'\n'}
                    HOME:{'\n'}This is your home page. You are able to view your
                    active chats and pending chats here.
                    {'\n'}
                    {'\n'}
                    DASHBOARD:{'\n'}To your top left is your dashboard. You are
                    able to view Profile, Map View, Pending/Active Chats and
                    Meetings here.
                    {'\n'}
                    {'\n'}
                    CHATS:{'\n'}In the Dashboard and on the Home page you are
                    able to chat with others. After you click the '+ Chat'
                    button our database will create a pending chat, to which
                    will match you with somebody relative to your preferences.
                    {'\n'}
                    {'\n'}
                    MEETINGS:{'\n'}In the Dashboard you are able to see your
                    meetings. These can be pending or active based on if you or
                    your linked partner accept an invitation to a meeting in
                    your chat.
                  </Text>
                </ScrollView>
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
            {this.props.myChats && this.props.myChats.length ? (
              <>
                <ActiveComp preview={true} />
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
                style={{backgroundColor: '#E0115F'}}
                onPress={async () => {
                  const chat = await this.props.findOrCreateChat(
                    this.props.user.id
                  )
                  const otherUser = chat.users.find(
                    user => user.fullName !== this.props.user.fullName
                  )
                  if (otherUser) { //Only emit this chat, if the chat created is active. Emits so that other user knows they have to refetch to change their pending chat to active.
                    socket.emit('sendNewChat', {chat, otherUser})
                  }
                }}
              >
                <Icon
                  style={{color: '#9B111E'}}
                  name="pluscircle"
                  type="AntDesign"
                >
                  <Text style={{color: '#9B111E'}}> New Chat</Text>
                </Icon>
              </Button>
            </Right>
          </Content>
        </ScrollView>
      </Container>
    )
  }
}

export const styles = StyleSheet.create({
  spinner: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect(({myChats, user}) => ({myChats, user}), {
  fetchMyChats,
  findOrCreateChat,
  setUser,
  fetchUserLogin,
  ConvertUser,
  fetchUserFromAsync
})(Home)
