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
import { ScrollView, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { fetchMessages, newMessage } from '../redux/message';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import {url} from '../secrets'

class SingleChats extends Component {
  constructor(props) {
    super(props);
    this.onSend2 = this.onSend2.bind(this);
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
    this.socket = io(url)
    this.props.fetchMessages(1);
    // console.log('this is happening');
  }

  // onSend(messages = []) {
  //   this.setState(previousState => ({
  //     messages: GiftedChat.append(previousState.messages, messages),
  //   }));
  // }

  async onSend2(message) {
    const newMessage = {
      content: message[0].text,
      userId: message[0].user._id,
      length: message[0].text.length,
      chatId: 1,
    };
    await this.props.newMessage(newMessage);
    this.props.fetchMessages(1)
  }
  render() {
    let key = this.props.messages.length;
    // console.log('here is after fetching', this.props.messages);
    // console.log('length',this.props.messages.length)
    return (
      // <View>
      //   {this.props.messages.map(message => {
      //     return <Text key={message._id}>{message.text}</Text>;
      //   })}
      //   <Button
      //     onPress={() =>
      //       this.onSend2([{ text: 'testingman', user: { _id: 1 } }])
      //     }
      //   >
      //     <Text>click me</Text>
      //   </Button>
      // </View>
      <GiftedChat
        key= {key}
        messages={this.props.messages || []}
        onSend={messages => this.onSend2(messages)}
        user={{
          _id: 1,
          name: 'Big Boi',
          avatar: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/dc23cd051d2249a5903d25faf8eeee4c/BFV36537_CC2017_2IngredintDough4Ways-FB.jpg',
        }}
      />
      // <Container >
      //   <Header>
      //     <Left>
      //       <Button transparent>
      //         <Icon name="menu" />
      //       </Button>
      //     </Left>
      //     <Body>
      //       <Title>Chating with another user name</Title>
      //     </Body>
      //     <Right />
      //   </Header>
      //   <Content>
      //     <ScrollView>
      //       <View>{/* render out the messages */}</View>
      //     </ScrollView>
      //   </Content>
      //   <Footer>
      //     <FooterTab>
      //         <Left>
      //           <Button transparent>
      //             <Icon />
      //             {/* only unlock at 25%. a mic icon? */}
      //           </Button>
      //         </Left>
      //         <Item rounded style={{alignSelf:"center"}}>
      //           <Input placeholder={'/type text in here/'} />
      //         </Item>
      //     </FooterTab>
      //   </Footer>
      // </Container>
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
