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
          <View>
            {/* MAP */}
          </View>
          <Right>
            {/* ternary to show or hide the yelp review */}
            <Button></Button>
          </Right>
        </Content>
        {/* if a marker exist in map render */}
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
