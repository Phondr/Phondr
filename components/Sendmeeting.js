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
import {View} from 'react-native'

export default class Sendingmeetings extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body />
          <Right />
        </Header>
        <Content>
          {/* If progess = 100% render below */}
          <View>
            <Form>
              <View>
                <Item>
                  <Input placeholder={'/type text in here/'} />
                </Item>
              </View>
              <View>
                <Text>coordinates</Text>
              </View>
              <Button>
                {/* Date picker */}
              </Button>
            </Form>
          </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button full>
              <Text>Submit</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}
