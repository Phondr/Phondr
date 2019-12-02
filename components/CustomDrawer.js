import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native'
import React, { useState } from 'react'
import { Container, Content, Header, Body, Drawer } from 'native-base'
import { DrawerItems } from 'react-navigation'

const CustomDrawer = props => {
  return (
    <Container style={{backgroundColor: '#A8C3BC'}}>
      <Content>
        <Image
          style={styles.drawerImage}
          source={require('../assets/images/robot-dev.png')}
        />

        <DrawerItems {...props} />
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create({
  drawerImage: {
    marginTop: Platform.OS !== 'ios' ? 15 : 0,
    height: 100,
    width: 100,
    borderRadius: 75,
  },
})

export default CustomDrawer
