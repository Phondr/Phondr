import React, {Component} from 'react'
import {
  Container,
  Header,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text
} from 'native-base'
import {ScrollView,View} from 'react-native'

export default class Meetview extends Component {
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
          <ScrollView>
            {/* If progess = 100% render below */}
            <View>
              <Button>
                {/* redirect to map view and store the chatname? */}
              </Button>
            </View>
          </ScrollView>
        </Content>
      </Container>
    )
  }
}
