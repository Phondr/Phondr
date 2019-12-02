import React, {Component} from 'react'
import {AsyncStorage} from 'react-native'
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import {Container, Button, Icon, Content, Left, Right} from 'native-base'

export class SignOut extends Component {
  static navigationOptions = {
    drawerIcon: ({tintColor}) => {
      return <Icon name="home" style={{fontSize: 24, color: tintColor}}></Icon>
    }
  }

  async componentDidMount() {
    try {
      await AsyncStorage.removeItem('userKey')
      this.props.navigation.navigate('Entry')
      console.log('REMOVED KEY')
    } catch (e) {
      // error reading value
      console.log('COULD NOT REMOVE ASYNC STORAGE KEY ON SIGNOUT')
    }
  }

  render() {
    return <View></View>
  }
}

export default SignOut
