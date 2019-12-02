import React from 'react'
import {Header, Left, Right, Body, Button, Icon, Text, Title} from 'native-base'
import {StyleSheet, StatusBar} from 'react-native'
import {Platform} from '@unimodules/core'
import {withNavigation} from 'react-navigation'

const CustomHeader = ({title = '', navigation}) => {
  return (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.openDrawer()}>
          <Icon name="menu" />
        </Button>
      </Left>
      <Body>
        <Title>{title}</Title>
      </Body>
      <Right />
    </Header>
  )
}
const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS !== 'ios' ? StatusBar.currentHeight : 0,
    justifyContent: 'flex-end',
    backgroundColor: '#727472'
  }
})

export default withNavigation(CustomHeader)
