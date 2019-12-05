import React, {Component} from 'react'
import {Text, View, StyleSheet, Image, Button} from 'react-native'
import Spinner from '../components/Spinner'
import {navigation} from 'react-navigation'
import Login from './Login'
import Signup from './Signup'
import {AsyncStorage} from 'react-native'
import {fetchUserLogin, setUser} from '../redux/user'
import {connect} from 'react-redux'

export class Entry extends Component {
  constructor() {
    super()
    this.state = {user: '', loading: true}
  }
  async componentDidMount() {
    const user = JSON.parse(await AsyncStorage.getItem('userKey'))

    // await this.props.fetchUserFromUserId(userd.id)
    // const user = this.props.user

    //Current Settings
    // if (user) {
    //   await this.props.setUser(user)
    //   this.props.navigation.navigate('Home', {user})
    if (user !== null) {
      if (this.state.user === '') {
        this.setState({user}) //Sets user if user was previously logged in through asyncStorage
      }
      if (this.state.user !== '') {
        await this.props.setUser(user)

        console.log('USER', user)
        setTimeout(() => {
          this.props.navigation.navigate('Home', {user})
        }, 100)

        //this.props.navigation.navigate('Home', {user}) //If previously logged in, skip the entry screen
      }
    }
    if (this.state.loading) {
      this.setState({loading: false})
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
    // if (this.state.loading) {
    //   return <Spinner />
    // }
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Image
            style={styles.phonderimage}
            source={require('../assets/images/PhondrLogos/PhondrLarge-removebg-preview.png')}
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

export default connect(({user}) => ({user}), {
  fetchUserLogin,
  setUser
})(Entry)
