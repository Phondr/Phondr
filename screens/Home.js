import React, { Component } from 'react'
import {
  ImageBackground,
  View,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native'
import {
  Container,
  Button,
  H3,
  Icon,
  Header,
  Content,
  Left,
  Body,
  Right,
} from 'native-base'
import { Platform } from '@unimodules/core'
import { New } from '../components/route'

class Home extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => {
      return (
        <Icon name='home' style={{ fontSize: 24, color: tintColor }}></Icon>
      )
    },
  }
  render() {
    return (
      <Container>
        <StatusBar barStyle='light-content' />
        <Header style={styles.header}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name='menu' />
            </Button>
          </Left>
          <Body />
          <Right />
        </Header>
        <Content
        // contentContainerStyle={{
        //   flex: 1,
        //   alignItems: 'center',
        //   justifyContent: 'center',
        // }}
        >
          <Text>Home</Text>
          <New />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS !== 'ios' ? 15 : 0,
    justifyContent: 'flex-end',
  },
})

export default Home
