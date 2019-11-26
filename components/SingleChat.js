import React, { Component } from 'react';
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
} from 'native-base';
import { ScrollView, View, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { fetchMessages, newMessage } from '../redux/message';
import { connect } from 'react-redux';
import socket from '../redux/socketClient';
import FlashMessage from 'react-native-flash-message'
import {showMessage} from 'react-native-flash-message'

class SingleChats extends Component {
  constructor(props) {
    super(props);
    this.onSend = this.onSend.bind(this);
  }
  // state = {
  //   messages: [],
  // };

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

  componentDidMount() {
    // this.socket = io(url);
    socket.emit('subscribe-to-chat', { chatId: 1 });
    socket.on('loginLogoutMessage', ({message}) => {
      showMessage({message, type: 'info', duration: 2500, icon:'info'})
      console.log(message)
    })
    socket.on('receiveMessage', ({message})=>{
      this.props.newMessage(message)
    })
    this.props.fetchMessages(1);
  }

  componentWillUnmount() {
    socket.emit('unsubscribe-to-chat', { chatId: 1 });
    socket.off('loginLogoutMessage')
    socket.off('receiveMessage')
  }

  async onSend(message) {
    const newMessage = {
      content: message[0].text,
      userId: message[0].user._id,
      length: message[0].text.length,
      chatId: 1,
    };
    socket.emit('sendMessage', {message: newMessage, chatId: 1})
  }
  render() {
    return (
      <GiftedChat
        messages={this.props.messages || []}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 2,
          name: 'Big Boi',
          avatar:
            'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/dc23cd051d2249a5903d25faf8eeee4c/BFV36537_CC2017_2IngredintDough4Ways-FB.jpg',
        }}
      />
    );
  }
}

const MapStateToProps = state => {
  return {
    messages: state.messages,
  };
};
const MapDispatchToProps = dispatch => {
  return {
    fetchMessages: chatId => dispatch(fetchMessages(chatId)),
    newMessage: message => dispatch(newMessage(message)),
  };
};

export default connect(MapStateToProps, MapDispatchToProps)(SingleChats);
