import {Platform, StatusBar, StyleSheet, View, Text, Image} from 'react-native'
import React, {useState} from 'react'
import {Container, Content, Header, Body, Drawer} from 'native-base'
import {DrawerItems} from 'react-navigation'

const CustomDrawer = props => {
  return (
    <Container>
      <Content>
        <Image
          style={styles.drawerImage}
          source={require('../assets/images/PhondrLogos/PhondrLarge.png')}
        />

        <DrawerItems {...props} />
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create({
  drawerImage: {
    marginTop: Platform.OS !== 'ios' ? 15 : 0,
    marginLeft: 15,
    height: 150,
    width: 150,
    borderRadius: 75
  }
})

export default CustomDrawer
