import {Platform, StatusBar, StyleSheet, Image} from 'react-native'
import React, {useState} from 'react'
import {Container, Content} from 'native-base'
import {DrawerItems} from 'react-navigation'

const CustomDrawer = props => {
  return (
    <Container  style={{backgroundColor:'#D9004C'}}>
      <Content >
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
