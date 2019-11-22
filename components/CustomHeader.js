import React from 'react'
import { Header, Left, Right, Body, Button, Icon } from 'native-base'
import { StyleSheet, StatusBar } from 'react-native'
import { Platform } from '@unimodules/core'
import { withNavigation } from 'react-navigation'

const CustomHeader = props => {
  return (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => props.navigation.openDrawer()}>
          <Icon name='menu' />
        </Button>
      </Left>
      <Body />
      <Right />
    </Header>
  )
}
const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS !== 'ios' ? StatusBar.currentHeight : 0,
    justifyContent: 'flex-end',
  },
})

export default withNavigation(CustomHeader)
