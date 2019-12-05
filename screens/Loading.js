import React, {Component} from 'react'
import {
  ImageBackground,
  View,
  StatusBar,
  StyleSheet,
  Text,
  Image
} from 'react-native'
import {
  Container,
  Button,
  Icon,
  Content,
  Left,
  Right,
  Spinner
} from 'native-base'

export class Loading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../assets/images/PhondrLogos/PhondrLarge-removebg-preview.png')}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 400,
    height: 400
  }
})

export default Loading
