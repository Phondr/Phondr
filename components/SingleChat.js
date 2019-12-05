import React, {Component} from 'react'
import {Icon, Fab, Button} from 'native-base'
import {
  ScrollView,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {GiftedChat, Bubble} from 'react-native-gifted-chat'
import {fetchMessages, newMessage, setNewMessage} from '../redux/message'
import {fetchCurrentChat} from '../redux/currentChat'
import {connect} from 'react-redux'
import socket from '../redux/socketClient'
import {showMessage} from 'react-native-flash-message'
import CustomHeader from '../components/CustomHeader'
import RecordAudio from './recordAudio'
import RenderAudio from './renderAudio'
import {placesAPI} from '../secrets'
import axios from 'axios'
import ChatBubbleWithReply from '../components/ChatBubbleWithReply'
import ReplyToFooter from '../components/ReplyToFooter'
import {fetchMeeting} from '../redux/currentMeeting'
import MeetingResponse from '../components/MeetingResponse'
import {NavigationEvents} from 'react-navigation'
import ChatEvent from '../components/ChatEvent'
import {calcProgress} from '../util'
import Spinner from '../components/Spinner'
class SingleChats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reply: false,
      curMessage: {},
      loading: true
    }
    this.onSend = this.onSend.bind(this)
    this.setActive = this.setActive.bind(this)
    this.getOtherUserInChat = this.getOtherUserInChat.bind(this)
    this.renderBubble = this.renderBubble.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.sendMeeting = this.sendMeeting.bind(this)
    //this.renderChatFooter = this.renderChatFooter.bind(this)
    //this.renderBubble = this.renderBubble.bind(this)
  }
  // componentWillMount() {
  //   this.setState({
  //     messages: [
  //       {
  //         _id: 1,
  //         text: 'Hello developer',
  //         createdAt: new Date(),
  //         user: {
  //           _id: 1,
  //           name: 'React Native',
  //           avatar: 'https://placeimg.com/140/140/any',
  //         },
  //       },
  //     ],
  //   });
  // }

  static navigationOptions = {
    //This is here so it doesn't show up on the drawer pull out
    drawerLabel: () => null
  }

  componentDidMount() {
    //this is necessary for users being sent from meetings
    // if (!this.props.currentChat.users) {
    //   this.props.fetchCurrentChat(this.props.currentChat.id)
    // }
    socket.emit('subscribe-to-chat', {chatId: this.props.currentChat.id})
    socket.on('loginLogoutMessage', ({message}) => {
      showMessage({message, type: 'info', duration: 2500, icon: 'info'})
    })
    //Look for when receiveMessage is emitted, and grab the message and set to redux state
    socket.on('receiveMessage', ({message}) => {
      this.props.setNewMessage(message)
    })

    this.props
      .fetchMessages(this.props.currentChat.id)
      .then(() => this.setState({loading: false}))
  }

  // async imageRequest(ref) {
  //   const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${placesAPI}`
  //   const image = await axios.post(url)
  //   console.log('TCL: image', image)

  //   return image
  // }

  // UNSAFE_componentWillUpdate(nextProps) {
  //   if (
  //     nextProps.currentMeeting !== this.props.currentMeeting &&
  //     this.props.navigation.getParam('created', 'none') === true
  //   ) {
  //     const {
  //       name,
  //       address,
  //       link,
  //       location,
  //       date,
  //       imageRef,
  //       id
  //     } = nextProps.currentMeeting
  //     const formattedMessage = {
  //       content: `${link}++New Invitation To Meet!++Address: ${address}++Date: ${new Date(
  //         +date
  //       ).toString()}++++Long press this message to respond.`,
  //       imageRef: imageRef,
  //       meetingId: id,
  //       userId: nextProps.user.id,
  //       length: 10,
  //       chatId: nextProps.currentChat.id
  //     }
  //     this.onSend(formattedMessage, true)
  //   }
  // }
  // componentDidUpdate(prevProps) {
  //   if (
  //     prevProps.currentMeeting !== this.props.currentMeeting &&
  //     this.props.navigation.getParam('created', 'none') === true
  //   ) {
  //     const {
  //       name,
  //       address,
  //       link,
  //       location,
  //       date,
  //       imageRef,
  //       id
  //     } = this.props.currentMeeting
  //     const formattedMessage = {
  //       content: `${link}++New Invitation To Meet!++Address: ${address}++Date: ${new Date(
  //         +date
  //       ).toString()}++++Long press this message to respond.`,
  //       imageRef: imageRef,
  //       meetingId: id,
  //       userId: this.props.user.id,
  //       length: 10,
  //       chatId: this.props.currentChat.id
  //     }
  //     this.onSend(formattedMessage, true)
  //   }
  // }

  async sendMeeting() {
    console.log(
      'outside send meeting',
      this.props.navigation.getParam('created')
    )
    if (this.props.navigation.getParam('created')) {
      const {
        name,
        address,
        link,
        location,
        date,
        imageRef,
        id
      } = this.props.currentMeeting
      const formattedMessage = {
        content: `${link}++++New Invitation To Meet!++Name: ${name}++Address: ${address}++Date: ${new Date(
          +date
        ).toString()}++++Long press this message to respond.`,
        imageRef: link,
        meetingId: id,
        userId: this.props.user.id,
        length: 10,
        chatId: this.props.currentChat.id
      }
      console.log('formatted message inside sendmeeting', formattedMessage)
      await this.onSend(formattedMessage, true)
      this.props.navigation.setParams({created: false})
    }
    this.setState({loading: false})
  }

  // async renderBubble(props) {
  //   // if (this.props.currentMeeting) {
  //   //   console.log('props current meeting', this.props.currentMeeting)
  //   // }
  //   // if (
  //   //   props.currentMessage.text.includes('New Invitation To Meet!') &&
  //   //   this.props.currentMeeting.name
  //   // ) {
  //   //   console.log('inside conditional preview link')
  //   //   return <PreviewLink currentMeeting={this.props.currentMeeting} />
  //   // }
  //   // console.log('rendering bubble')
  //   let image = ''
  //   if (this.props.currentMeeting && this.props.currentMeeting.name) {
  //     image = this.imageRequest(this.props.currentMeeting.imageRef)
  //     props.currentMessage.image = image
  //   }
  // }

  componentWillUnmount() {
    socket.emit('unsubscribe-to-chat', {chatId: this.props.currentChat.id})
    socket.off('loginLogoutMessage')
    socket.off('receiveMessage')
  }

  // renderChatFooter() {
  //   if (this.state.reply) {
  //     console.log('message inside of renderChatFooter', this.props.messages[0])
  //     return (
  //       <ReplyToFooter
  //         reply_to={this.props.messages[0].user.name}
  //         closeDialog={this.closeDialog}
  //         meetingId={this.props.messages[0].meetingId}
  //       />
  //     )
  //   }
  //   return null
  // }

  closeDialog() {
    this.setState({reply: false})
  }

  async onSend(message, noFormat) {
    //Format message for input into thunk

    let formattedMessage
    if (noFormat) {
      formattedMessage = message
    } else {
      formattedMessage = {
        content: message[0].text,
        userId: message[0].user._id,
        length: message[0].text.length,
        chatId: this.props.currentChat.id,
        audio: message[0].audio || null
      }
    }

    //Create the message ONCE after click send but don't set to redux yet
    const newMessage = await this.props.newMessage(formattedMessage)
    await this.props.fetchCurrentChat(this.props.currentChat.id)
    //Send created message to sockets with event sendMessage
    socket.emit('sendMessage', {
      message: newMessage,
      chatId: this.props.currentChat.id
    })
    socket.emit('sendNewMessageNotification', {otherUser: this.getOtherUserInChat(this.props.currentChat), user: this.props.user})
  }
  setActive() {
    this.setState({active: true})
  }

  getOtherUserInChat(chat) {
    return chat.users.find(user => user.fullName !== this.props.user.fullName)
  }

  renderBubble(props) {
    if (props.currentMessage.audio) {
      //Render the play audio icon if the message has audio along with the timestamp
      return (
        <View>
          <RenderAudio message={props.currentMessage} user={this.props.user} />
          <Bubble {...props} />
        </View>
      )
    }
    return (
      //Render normal text bubble with timestamp
      <View>
        <Bubble {...props} />
      </View>
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <React.Fragment>
          <Spinner />
          <NavigationEvents
            onDidFocus={() => {
              this.sendMeeting()
            }}
          />
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <NavigationEvents
          onDidFocus={() => {
            this.sendMeeting()
          }}
        />
        {this.state.curMessage.user && (
          <MeetingResponse
            reply={this.state.reply}
            reply_to={this.state.curMessage.user.name}
            closeDialog={this.closeDialog}
            meetingId={this.state.curMessage.meetingId}
          />
        )}
        <StatusBar barStyle="light-content" />
        <CustomHeader
          title={`${this.getOtherUserInChat(this.props.currentChat).fullName}`}
          currentChat={this.props.currentChat}
        />
        {calcProgress(this.props.currentChat) >= 0 ? (
          <TouchableOpacity
            style={
              Platform.OS === 'ios'
                ? Dimensions.get('window').height === 812
                  ? styles.iosMike
                  : styles.ios
                : styles.android
            }
            onPress={() => {
              this.setState({loading: true})
              this.props.navigation.navigate('MeetingModal')
            }}
          >
            <Icon name="meetup" color="blue" type={'FontAwesome'} />
          </TouchableOpacity>
        ) : null}
        {calcProgress(this.props.currentChat) > 25 ? (
          <RecordAudio
            user={this.props.user}
            chat={this.props.currentChat}
            messageLength={this.props.messages.length}
          />
        ) : null}
        {calcProgress(this.props.currentChat) > 50 ? (
          <TouchableOpacity
            style={
              Platform.OS === 'ios'
                ? Dimensions.get('window').height === 812
                  ? styles.iosPictureMike
                  : styles.iosPicture
                : styles.androidPicture
            }
            onPress={() =>
              this.props.navigation.navigate('PicturePicker', {
                otherUser: this.getOtherUserInChat(this.props.currentChat)
              })
            }
          >
            <Icon
              name="ios-contacts"
              style={{color: '#6de0e8'}}
              type={'Ionicons'}
            />
          </TouchableOpacity>
        ) : null}
        {calcProgress(this.props.currentChat) >= 100 ? (
          <TouchableOpacity
            style={
              Platform.OS === 'ios'
                ? Dimensions.get('window').height === 812
                  ? styles.iosMike
                  : styles.ios
                : styles.android
            }
            onPress={() => this.props.navigation.navigate('MeetingModal')}
          >
            <Icon name="meetup" style={{color: 'blue'}} type={'FontAwesome'} />
          </TouchableOpacity>
        ) : null}
        <GiftedChat
          messages={this.props.messages || []}
          onSend={messages => this.onSend(messages)}
          //renderChatFooter={this.renderChatFooter}
          onLongPress={(context, message) => {
            console.log('TCL: message inside onLongPress', message)
            if (message.text.includes('New Invitation')) {
              this.setState({reply: true, curMessage: message})
            } else {
              alert('You can only respond to invitations!')
            }
          }}
          user={{
            _id: this.props.user.id,
            name: this.props.user.fullName
          }}
          renderBubble={this.renderBubble}
        />
        {Platform.OS === 'android' && (
          <KeyboardAvoidingView behavior="padding" />
        )}
        <Button
          rounded
          style={{
            backgroundColor: '#E0115F',
            position: 'absolute',
            marginTop: 595,
            marginLeft: 260
          }}
          onPress={() => this.props.navigation.navigate('MeetingModal')}
        >
          <Icon
            style={{alignSelf: 'center', backgroundColor: '#E0115F'}}
            name="meetup"
            type={'FontAwesome'}
          />
        </Button>
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  iosPicture: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'transparent',
    marginTop: Dimensions.get('window').height * 0.865,
    marginLeft: Dimensions.get('window').width * 0.8
  },
  iosPictureMike: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'transparent',
    marginTop: Dimensions.get('window').height * 0.85,
    marginLeft: Dimensions.get('window').width * 0.8
  },
  androidPicture: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'transparent',
    marginTop: Dimensions.get('window').height * 0.88,
    marginLeft: Dimensions.get('window').width * 0.8
  },
  ios: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'transparent',
    marginTop: Dimensions.get('window').height * 0.865,
    marginLeft: Dimensions.get('window').width * 0.7
  },
  iosMike: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'transparent',
    marginTop: Dimensions.get('window').height * 0.85,
    marginLeft: Dimensions.get('window').width * 0.7
  },
  android: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'transparent',
    marginTop: Dimensions.get('window').height * 0.88,
    marginLeft: Dimensions.get('window').width * 0.7
  }
})

const MapStateToProps = state => {
  return {
    user: state.user,
    messages: state.messages,
    currentChat: state.currentChat,
    currentMeeting: state.currentMeeting
  }
}
const MapDispatchToProps = dispatch => {
  return {
    fetchMessages: chatId => dispatch(fetchMessages(chatId)),
    newMessage: message => dispatch(newMessage(message)),
    setNewMessage: message => dispatch(setNewMessage(message)),
    fetchCurrentChat: chatId => dispatch(fetchCurrentChat(chatId)),
    fetchMeeting: chatId => dispatch(fetchMeeting(chatId))
  }
}

export default connect(MapStateToProps, MapDispatchToProps)(SingleChats)
