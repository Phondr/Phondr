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
  Input
} from 'native-base'
import {ScrollView, View} from 'react-native'

export default class SingleChats extends Component {
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
            <Title>Chating with another user name</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <ScrollView>
            <View>{/* render out the messages */}</View>
          </ScrollView>
        </Content>
        <Footer>
          <FooterTab>
            <Form>
              <Left>
                <Button transparent>
                  <Icon />
                  {/* only unlock at 25%. a mic icon? */}
                </Button>
              </Left>
              <Item>
                <Input placeholder={'/type text in here/'} />
              </Item>
            </Form>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}
