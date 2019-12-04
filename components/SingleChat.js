import React, {Component} from 'react'
import {Icon, Fab, Button} from 'native-base'
import {
  ScrollView,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform
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

class SingleChats extends Component {
  constructor(props) {
    super(props)
    this.state = {active: false}
    this.onSend = this.onSend.bind(this)
    this.setActive = this.setActive.bind(this)
    this.getOtherUserInChat = this.getOtherUserInChat.bind(this)
    this.renderBubble = this.renderBubble.bind(this)
    this.imageRequest = this.imageRequest.bind(this)
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
    socket.emit('subscribe-to-chat', {chatId: this.props.currentChat.id})
    socket.on('loginLogoutMessage', ({message}) => {
      showMessage({message, type: 'info', duration: 2500, icon: 'info'})
    })
    //Look for when receiveMessage is emitted, and grab the message and set to redux state
    socket.on('receiveMessage', ({message}) => {
      this.props.setNewMessage(message)
    })

    this.props.fetchMessages(this.props.currentChat.id)
  }

  async imageRequest(ref) {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${placesAPI}`
    const image = await axios.post(url)
    console.log('TCL: image', image)

    return image
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (nextProps.currentMeeting !== this.props.currentMeeting) {
      const {
        name,
        address,
        link,
        location,
        date,
        imageRef
      } = nextProps.currentMeeting
      const formattedMessage = {
        content: `${link}++New Invitation To Meet!++Address: ${address}++Date: ${new Date(
          +date
        ).toString()}`,
        imageRef: imageRef,
        userId: nextProps.user.id,
        length: 10,
        chatId: nextProps.currentChat.id
      }
      this.onSend(formattedMessage, true)
    }
  }

  componentWillUnmount() {
    socket.emit('unsubscribe-to-chat', {chatId: this.props.currentChat.id})
    socket.off('loginLogoutMessage')
    socket.off('receiveMessage')
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentChat !== this.props.currentChat) {
      console.log('got here')
    }
    if (this.props.messages.length !== this.props.currentChat.messages.length) {
      this.props.fetchCurrentChat(this.props.currentChat.id)
    }
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
    //Send created message to sockets with event sendMessage
    socket.emit('sendMessage', {
      message: newMessage,
      chatId: this.props.currentChat.id
    })
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
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        <CustomHeader
          title={`${this.getOtherUserInChat(this.props.currentChat).fullName}`}
          currentChat={this.props.currentChat}
        />


        <RecordAudio
          onSend={this.onSend}
          user={this.props.user}
          chat={this.props.currentChat}
          messageLength={this.props.messages.length}
        />
        <GiftedChat
          messages={this.props.messages || []}
          onSend={messages => this.onSend(messages)}
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
            position:'absolute',
            marginTop: 595,
            marginLeft:260
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
    fetchCurrentChat: chatId => dispatch(fetchCurrentChat(chatId))
  }
}

export default connect(MapStateToProps, MapDispatchToProps)(SingleChats)
