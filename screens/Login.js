import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import t from 'tcomb-form-native'
import {connect} from 'react-redux'
import {fetchUserLogin} from '../redux/user'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {throwServerError} from 'apollo-link-http-common'
import {navigate, NavigationEvents} from 'react-navigation'
import Spinner from '../components/Spinner'
import {LinearGradient} from 'expo-linear-gradient'
import * as Font from 'expo-font'

const User = t.struct({
  email: t.String,
  password: t.String
})

const options = {
  fields: {
    email: {
      error: 'You need a valid email to login to your account'
    },
    password: {
      password: true,
      secureTextEntry: true,
      error: 'You need a valid password to login to your account'
    }
  }
}

const Form = t.form.Form

export class Login extends Component {
  constructor() {
    super()
    this.state = {fontsLoaded: false}
    this.login = this.login.bind(this)
    this.navigateHome = this.navigateHome.bind(this)
  }

  async componentDidMount() {
    await Font.loadAsync({
      lobster: require('../assets/fonts/Lobster/Lobster-Regular.ttf')
    })
    this.setState({fontsLoaded: true})
  }

  //this is what eric changed
  // componentDidUpdate(prevProps) {
  //   if (this.props.user.id) {
  //     console.log('go home')
  //     this.props.navigation.navigate('Home')
  //   }
  // }
  static navigationOptions = {
    drawerLabel: () => null
  }

  async login() {
    //this.setState({loading: true})
    const values = this._form.getValue()
    console.log('TCL: values', values)

    try {
      await this.props.getUser(values)
      if (this.props.user.id) {
        console.log('HEREBOI')
        this.props.navigation.navigate('loggedIn')
      }
    } catch (error) {
      //this.setState({loading: false})
      alert('COULD NOT LOGIN')
      //this.props.navigation.navigate('Entry')
      console.log(error)
    }
  }

  navigateHome() {
    return this.props.navigation.navigate('loggedIn')
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.topcontainer}>
            <View style={styles.container}>
              <NavigationEvents
                onDidFocus={async payload => {
                  if (this.props.user.id) {
                    console.log('go home')
                    this.navigateHome()
                  }
                }}
              />
              <Form ref={c => (this._form = c)} type={User} options={options} />
            </View>
            <TouchableOpacity onPress={this.login}>
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
          </View>
        </TouchableWithoutFeedback>
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
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#00BFFF'
  },
  spinner: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#F5FCFF'
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: 'black',
    borderWidth: 1
  },
  submitButton: {
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    flexDirection: 'row',
    width: Dimensions.get('window').width
  },
  submitButtonText: {
    color: 'white'
  },
  logintext: {
    margin: 2,
    fontSize: 30
  }
})

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  getUser: values => dispatch(fetchUserLogin(values))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
