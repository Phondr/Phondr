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
  ScrollView
} from 'react-native'
import t from 'tcomb-form-native'
import {connect} from 'react-redux'
import {fetchUserLogin} from '../redux/user'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {throwServerError} from 'apollo-link-http-common'
import {navigate, NavigationEvents} from 'react-navigation'
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
      this.props.navigation.navigate('loggedIn')
    } catch (error) {
      this.setState({loading: false})
      alert('COULD NOT LOGIN')
      console.log(error)
    }
  }

  navigateHome() {
    return this.props.navigation.navigate('loggedIn')
  }

  render() {
    // if (this.state.loading) {
    //   return <Spinner />
    // }
    return (
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
            <Text style={{color: 'white'}}>Login</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export const styles = StyleSheet.create({
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
    padding: 10,
    margin: 15,
    alignItems: 'center',
    height: 40,
    borderRadius: 30
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
