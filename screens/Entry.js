import React, {Component} from 'react'
import {Text, View, StyleSheet, Image, Button} from 'react-native'
import {navigation} from 'react-navigation'
import Login from './Login'
import Signup from './Signup'
import {AsyncStorage} from 'react-native'

export class Entry extends Component {
  constructor() {
    super()
    this.state = {user: ''}
  }
  async componentDidMount() {
    const user = JSON.parse(await AsyncStorage.getItem('userKey'))
    console.log('USER', user)
    if (user !== null) {
      if (this.state.user === '') {
        this.setState({user}) //Sets user if user was previously logged in through asyncStorage
      }
      if (this.state.user !== '') {
        this.props.navigation.navigate('Home', {user}) //If previously logged in, skip the entry screen
      }
    }
  }

  gotToLogin() {
    this.props.navigation.navigate('Login')
  }

  goToSignUp() {
    this.props.navigation.navigate('Signup')
  }
  static navigationOptions = {
    drawerLabel: () => null
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Image
            style={styles.phonderimage}
            source={{
              uri:
                'https://github.com/Phondr/Phondr/blob/login/assets/images/PhondrLogos/PhondrLarge.png?raw=true'
            }}
          />
        </View>
        <Button
          title="Login"
          onPress={() => {
            this.gotToLogin()
          }}
        />
        <Button
          title="Sign Up"
          onPress={() => {
            this.goToSignUp()
          }}
        />
      </View>
    )
  }
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  phonderimage: {
    width: 350,
    height: 350,
    position: 'relative',
    justifyContent: 'center'
  },
  logintext: {
    margin: 2,
    fontSize: 30
  },
  formcontainer: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    margin: 10,
    backgroundColor: '#ffffff'
  }
})

export default Entry
