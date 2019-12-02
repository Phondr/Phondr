import React, {Component} from 'react'
import {Icon, Fab, Button, View} from 'native-base'
import {StatusBar, KeyboardAvoidingView, Platform} from 'react-native'
import {GiftedChat} from 'react-native-gifted-chat'
import {fetchMessages, newMessage, setNewMessage} from '../redux/message'
import {connect} from 'react-redux'
import socket from '../redux/socketClient'
import {showMessage} from 'react-native-flash-message'
import CustomHeader from '../components/CustomHeader'

class SingleChats extends Component {
  constructor(props) {
    super(props)
    this.state = {active: false}
    this.onSend = this.onSend.bind(this)
    this.setActive = this.setActive.bind(this)
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

  componentWillUnmount() {
    socket.emit('unsubscribe-to-chat', {chatId: this.props.currentChat.id})
    socket.off('loginLogoutMessage')
    socket.off('receiveMessage')
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentChat !== this.props.currentChat) {
      console.log('got here')
    }
  }

  async onSend(message) {
    //Format message for input into thunk
    const formattedMessage = {
      content: message[0].text,
      userId: message[0].user._id,
      length: message[0].text.length,
      chatId: this.props.currentChat.id
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
  render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        <CustomHeader
          title={`Chat Room ${this.props.currentChat.id}`}
          currentChat={this.props.currentChat}
        />
        <Button
          style={{backgroundColor:'#85754E', width: '16%', alignSelf:"center"}}
          onPress={() => this.props.navigation.navigate('MeetingModal')}
        >
          <Icon style={{alignSelf:"center", backgroundColor:'#85754E' }} name="meetup" type={'FontAwesome'} />
        </Button>
        <GiftedChat
          messages={this.props.messages || []}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.props.user.id,
            name: this.props.user.fullName
          }}
        />

        {Platform.OS === 'android' && (
          <KeyboardAvoidingView behavior="padding" />
        )}
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
    setNewMessage: message => dispatch(setNewMessage(message))
  }
}

export default connect(MapStateToProps, MapDispatchToProps)(SingleChats)
