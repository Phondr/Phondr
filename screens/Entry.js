import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import Spinner from '../components/Spinner'
import {navigation} from 'react-navigation'
import Login from './Login'
import Signup from './Signup'
import {AsyncStorage} from 'react-native'
import {fetchUserLogin, setUser, fetchUserFromUserId} from '../redux/user'
import {connect} from 'react-redux'
import {LinearGradient} from 'expo-linear-gradient'
import * as Font from 'expo-font'

export class Entry extends Component {
  constructor() {
    super()
    this.state = {user: '', loading: true, fontsLoaded: false}
  }
  async componentDidMount() {
    const user = JSON.parse(await AsyncStorage.getItem('userKey'))

    await Font.loadAsync({
      lobster: require('../assets/fonts/Lobster/Lobster-Regular.ttf')
    })
    this.setState({fontsLoaded: true})

    //Current Settings
    // if (user) {
    //   await this.props.setUser(user)
    //   this.props.navigation.navigate('Home', {user})
    if (user !== null) {
      if (this.state.user === '') {
        this.setState({user}) //Sets user if user was previously logged in through asyncStorage
      }
      if (this.state.user !== '') {
        console.log('testomg', user)
        await this.props.fetchUserFromUserId(user.id)
        const userd = this.props.user

        await this.props.setUser(userd)
        console.log('ENTRY USER', userd)
        setTimeout(() => {
          this.props.navigation.navigate('Home', {user: userd})
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
    //   return (
    //     <View style={styles.spinner}>
    //       <Spinner />
    //     </View>
    //   )
    // }
    if (this.state.fontsLoaded) {
      return (
        <View style={styles.topcontainer}>
          <View style={styles.container}>
            <View style={styles.title}>
              <Image
                style={styles.phonderimage}
                source={require('../assets/images/PhondrLogos/Phondr-logo.png')}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              this.gotToLogin()
            }}
          >
            <LinearGradient
              colors={['#60dee7', '#75c6e5']}
              style={styles.submitButton}
            >
              <Text
                style={{color: 'white', fontFamily: 'lobster', fontSize: 20}}
              >
                Login
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.goToSignUp()
            }}
          >
            <LinearGradient
              colors={['#75c6e5', '#60dee7']}
              style={styles.submitButton}
            >
              <Text
                style={{color: 'white', fontFamily: 'lobster', fontSize: 20}}
              >
                Sign Up
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* <Button
          title="Login"
          onPress={() => {
            this.gotToLogin()
          }}
        /> */}
          {/* <Button
          title="Sign Up"
          onPress={() => {
            this.goToSignUp()
          }}
        /> */}
        </View>
      )
    } else {
      return (
        <View style={styles.spinner}>
          <Spinner />
        </View>
      )
    }
  }
}

export const styles = StyleSheet.create({
  topcontainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#F5FCFF'
  },
  phonderimage: {
    width: 500/1.5,
    height: 97/1.5,
    position: 'relative',
    alignSelf: 'center',
    justifyContent: 'center',
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
  submitButton: {
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    flexDirection: 'row',
    width: Dimensions.get('window').width
  },
  spinner: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect(({user}) => ({user}), {
  fetchUserLogin,
  setUser,
  fetchUserFromUserId
})(Entry)
