import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView
} from 'react-native'
import t from 'tcomb-form-native'
import {connect} from 'react-redux'
import {fetchUserLogin} from '../redux/user'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {throwServerError} from 'apollo-link-http-common'
<<<<<<< HEAD
import {navigate} from 'react-navigation'
import {relative} from 'path'
=======
import {navigate, NavigationEvents} from 'react-navigation'
>>>>>>> a5edb7afd7ce5abf73d55d0f14c1017e2c4845cf
import Spinner from '../components/Spinner'

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
    this.state = {loading: false}
    this.login = this.login.bind(this)
    this.navigateHome = this.navigateHome.bind(this)
  }

  componentDidMount() {}

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
    this.setState({loading: true})
    const values = this._form.getValue()
    console.log('TCL: values', values)

    try {
      await this.props.getUser(values)
      this.props.navigation.navigate('Home')
    } catch (error) {
      this.setState({loading: false})
      alert('COULD NOT LOGIN')
      console.log(error)
    }
  }

  navigateHome() {
    return this.props.navigation.navigate('Home')
  }

  render() {
    // if (this.state.loading) {
    //   return <Spinner />
    // }
    return (
<<<<<<< HEAD
      <View style={{backgroundColor: '#343434'}}>
        <View style={{alignItems: 'center', backgroundColor: '#343434'}}>
          <Image
            style={{width: '80%', height: 150, marginTop: 30}}
            source={require('../assets/images/fog.jpg')}
            resizeMode="cover"
          />
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <Form ref={c => (this._form = c)} type={User} options={options} />
            <TouchableOpacity onPress={this.login} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
        <View style={{alignItems: 'center', backgroundColor: '#343434'}}>
          <Image
            style={{width: '80%', height: 200, marginTop: 30}}
            source={require('../assets/images/fog.jpg')}
            resizeMode="cover"
          />
=======
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
          <TouchableOpacity onPress={this.login} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Login</Text>
          </TouchableOpacity>
>>>>>>> a5edb7afd7ce5abf73d55d0f14c1017e2c4845cf
        </View>
      </View>
    )
  }
}

export const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: '#E0115F',
    padding: 10,
    margin: 15,
    alignItems: 'center',
    height: 40
  },
  submitButtonText: {
    color: 'white'
  },
  formcontainer: {
    marginTop: 30,
    backgroundColor: '#343434'
  }
})

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  getUser: values => dispatch(fetchUserLogin(values))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
