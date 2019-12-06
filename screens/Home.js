import React, {Component} from 'react'
import {
  ImageBackground,
  View,
  StatusBar,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import {Container, Button, Icon, Content, Left, Right} from 'native-base'
import {Platform} from '@unimodules/core'
import Spinner from '../components/Spinner'
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
import {LinearGradient} from 'expo-linear-gradient'
import * as Font from 'expo-font'

class Home extends Component {
  constructor() {
    super()
    this.state = {
      user: {fullName: 'Avaree Warrick', id: 1, isNoob: true},
      defaultAnimationDialog: true,
      loading: true,
      fontsLoaded: false
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
    await Font.loadAsync({
      lobster: require('../assets/fonts/Lobster/Lobster-Regular.ttf')
    })
    this.setState({fontsLoaded: true})
    if (this.props.user.id) {
      //If brought from login screen, there is already user data on redux. Just grab chats.
      await this.setState({loading: false})
      this.props.fetchMyChats(this.props.user.id)
    }
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
    if (this.state.loading || !this.state.fontsLoaded) {
      return (
        <View style={styles.spinner}>
          <Spinner />
        </View>
      )
    }

    const user = this.props.user || {}

    return (
      <Container>
        <View style={styles.topcontainer}>
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
                      paling! Through Phondr you will be able to chat with
                      random people(within your preferences) within your city's
                      proximity, and see your phondr bar go up within your chat.
                      At 25%, 50%, 75%, and 100% you unlock special rewards
                      relating to your chat! At 100% you get the opportunity to
                      meet with your affiliated chat member!
                      {'\n'}
                      {'\n'}
                      HOME:{'\n'}This is your home page. You are able to view
                      your active chats and pending chats here.
                      {'\n'}
                      {'\n'}
                      DASHBOARD:{'\n'}To your top left is your dashboard. You
                      are able to view Profile, Map View, Pending/Active Chats
                      and Meetings here.
                      {'\n'}
                      {'\n'}
                      CHATS:{'\n'}In the Dashboard and on the Home page you are
                      able to chat with others. After you click the '+ Chat'
                      button our database will create a pending chat, to which
                      will match you with somebody relative to your preferences.
                      {'\n'}
                      {'\n'}
                      MEETINGS:{'\n'}In the Dashboard you are able to see your
                      meetings. These can be pending or active based on if you
                      or your linked partner accept an invitation to a meeting
                      in your chat.
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
            </Content>
          </ScrollView>

          <TouchableOpacity
            onPress={() => this.props.findOrCreateChat(this.props.user.id)}
          >
            <LinearGradient
              colors={['#75c6e5', '#60dee7']}
              style={styles.submitButton}
            >
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'lobster',
                  fontSize: 20
                }}
              >
                + New Chat
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Container>
    )
  }
}

export const styles = StyleSheet.create({
  topcontainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF'
  },
  spinner: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButton: {
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    flexDirection: 'row',
    width: Dimensions.get('window').width
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
