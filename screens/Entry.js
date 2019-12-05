import React, {Component} from 'react'
import {Text, View, StyleSheet, Image} from 'react-native'
import {Button} from 'native-base'
import Spinner from '../components/Spinner'
import {navigation} from 'react-navigation'
import Login from './Login'
import Signup from './Signup'
import {AsyncStorage} from 'react-native'
import {fetchUserLogin, setUser, fetchUserFromUserId} from '../redux/user'
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
    if (user !== null) {
      if (this.state.user === '') {
        this.setState({user}) //Sets user if user was previously logged in through asyncStorage
      }
      if (this.state.user !== '') {
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
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Image
            style={styles.phonderimage}
            source={require('../assets/images/PhondrLogos/PhondrLarge.png')}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            this.gotToLogin()
          }}
          style={styles.submitButton}
        >
          <Text style={{color: 'white'}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.goToSignUp()
          }}
          style={styles.submitButton}
        >
          <Text style={{color: 'white'}}>Sign Up</Text>
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
  }
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#353839'
  },
  phonderimage: {
    width: 350,
    height: 350,
    position: 'relative',
    justifyContent: 'center'
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
    padding: 10,
    margin: 15,
    alignItems: 'center',
    height: 40,
    borderRadius: 30
  },
  spinner: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonNav: {
    backgroundColor: '#E0115F',
    marginTop: 30,
    justifyContent: 'center'
  }
})

export default connect(({user}) => ({user}), {
  fetchUserLogin,
  setUser,
  fetchUserFromUserId
})(Entry)
