import React, {Component} from 'react'
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  View,
  Thumbnail,
} from 'native-base'
export default class Profile extends Component {
  render() {
    const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png"
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View><Thumbnail source={{uri: uri}} /></View>
          <View>
            <Text>name</Text>
            <Text>age</Text>
            <Text>gender</Text>
            <Text>homelocation</Text>
            <Text>incentive potins</Text>
            <Text>time Stamp</Text>
          </View>
        </Content>
      </Container>
    )
  }
}
