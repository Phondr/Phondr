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
  Text
} from 'native-base'
import {ScrollView,View} from 'react-native'

export default class AllChats extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>These are all my preys</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <ScrollView>
            <View>
              <Text>
                This will be where the list of the chats be.
                Each chat will have its own progress bar
              </Text>
            </View>
          </ScrollView>
        </Content>
        <Footer>
          <FooterTab>
            <Button full>
              <Text>Search for another chat</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}
