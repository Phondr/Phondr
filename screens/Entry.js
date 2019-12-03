import React, {Component} from 'react'
import {Text, View, StyleSheet, Image} from 'react-native'
import {Button} from 'native-base'
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

    //Current Settings
    // if (user) {
    //   await this.props.setUser(user)
    //   this.props.navigation.navigate('Home', {user})
    // if (user !== null) {
    //   if (this.state.user === '') {
    //     this.setState({user}) //Sets user if user was previously logged in through asyncStorage
    //   }
    //   if (this.state.user !== '') {
    //     this.props.setUser(user)
    //     this.props.navigation.navigate('Home', {user}) //If previously logged in, skip the entry screen
    //   }

    console.log('USER', user)
    if (user !== null) {
      if (this.state.user === '') {
        this.setState({user}) //Sets user if user was previously logged in through asyncStorage
      }
      if (this.state.user !== '') {
        this.props.setUser(user)
        this.props.navigation.navigate('Home', {user}) //If previously logged in, skip the entry screen
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
            style={{backgroundColor: '#E0115F', width:'50%', margin: 30, alignSelf='center', alignItems='center'}}
          ><Text>Login</Text> </Button>

          <Button
            title="Sign Up"
            onPress={() => {
              this.goToSignUp()
            }}
            style={{backgroundColor: 'black', width:'50%'}}
          ><Text>Sign Up</Text></Button>
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
    backgroundColor: '#353839'
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
  },
  loginStyle:{

  }
})

export default connect(({user}) => ({user}), {fetchUserLogin, setUser})(Entry)
