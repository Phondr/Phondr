import React, {Component} from 'react'
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Form,
  Item,
  Input,
  Fab
} from 'native-base'
import {
  ScrollView,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import {GiftedChat, Bubble, Message} from 'react-native-gifted-chat'
import {fetchMessages, newMessage, setNewMessage} from '../redux/message'
import {fetchCurrentChat} from '../redux/currentChat'
import {connect} from 'react-redux'
import socket from '../redux/socketClient'
import {showMessage} from 'react-native-flash-message'
import CustomHeader from '../components/CustomHeader'
import PreviewLink from '../components/PreviewLink'
import {placesAPI} from '../secrets'
import axios from 'axios'
import ChatBubbleWithReply from '../components/ChatBubbleWithReply'
import ReplyToFooter from '../components/ReplyToFooter'
import {fetchMeeting} from '../redux/currentMeeting'
class SingleChats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reply: false,
      accepted: false
    }
    this.onSend = this.onSend.bind(this)
    this.getOtherUserInChat = this.getOtherUserInChat.bind(this)
    this.imageRequest = this.imageRequest.bind(this)
    this.closeFooter = this.closeFooter.bind(this)
    this.renderChatFooter = this.renderChatFooter.bind(this)
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
    if (!this.props.currentMeeting.id) {
      this.props.fetchMeeting(this.props.currentChat.id)
    } else if (
      nextProps.currentMeeting !== this.props.currentMeeting &&
      this.props.navigation.getParam('created', 'none') === true
    ) {
      const {
        name,
        address,
        link,
        location,
        date,
        imageRef,
        id
      } = nextProps.currentMeeting
      const formattedMessage = {
        content: `${link}++New Invitation To Meet!++Address: ${address}++Date: ${new Date(
          +date
        ).toString()}`,
        imageRef: imageRef,
        meetingId: id,
        userId: nextProps.user.id,
        length: 10,
        chatId: nextProps.currentChat.id
      }
      this.onSend(formattedMessage, true)
    }
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
  //   //console.log(props)
  //   return <Bubble {...props} />
  //}

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
      console.log('how many times is this running')
      this.props.fetchCurrentChat(this.props.currentChat.id)
    }

    if (this.props.messages && this.props.messages.length) {
      console.log('this.props.messages', this.props.messages[0])
    }
    console.log('props messages[0]', this.props.messages[0])
    if (
      this.props.currentMeeting.status === 'pending' &&
      !this.state.reply &&
      this.props.messages &&
      this.props.messages.length &&
      this.props.messages[0].text.includes('New Invitation To Meet!') &&
      this.props.user.id === this.props.messages[0].user._id
    ) {
      console.log('props messages[0]', this.props.messages[0])
      this.setState({reply: true})
    }
  }

  renderChatFooter(message) {
    if (this.state.reply) {
      console.log('message inside of renderChatFooter', this.props.messages[0])
      return (
        <ReplyToFooter
          reply_to={this.props.messages[0].user.name}
          closeFooter={this.closeFooter}
          meetingId={this.props.messages[0].meetingId}
        />
      )
    }
    return null
  }

  closeFooter() {
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
        chatId: this.props.currentChat.id
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

  getOtherUserInChat(chat) {
    return chat.users.find(user => user.fullName !== this.props.user.fullName)
  }

  render() {
    console.log('this.state.reply', this.state.reply)
    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        <CustomHeader
          title={`${this.getOtherUserInChat(this.props.currentChat).fullName}`}
          currentChat={this.props.currentChat}
        />
        <Fab
          active={true}
          direction="up"
          containerStyle={{}}
          style={{backgroundColor: '#5067FF'}}
          position="topRight"
          onPress={() => this.props.navigation.navigate('MeetingModal')}
        >
          <Icon name="meetup" type={'FontAwesome'} />
        </Fab>
        <GiftedChat
          messages={this.props.messages || []}
          onSend={messages => this.onSend(messages)}
          renderChatFooter={this.renderChatFooter}
          user={{
            _id: this.props.user.id,
            name: this.props.user.fullName
          }}
          //renderBubble={this.renderBubble}
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
    setNewMessage: message => dispatch(setNewMessage(message)),
    fetchCurrentChat: chatId => dispatch(fetchCurrentChat(chatId)),
    fetchMeeting: chatId => dispatch(fetchMeeting(chatId))
  }
}

export default connect(MapStateToProps, MapDispatchToProps)(SingleChats)
