import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import t from 'tcomb-form-native'
import {connect} from 'react-redux'
import {fetchUserLogin} from '../redux/user'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {throwServerError} from 'apollo-link-http-common'
import {navigate} from 'react-navigation'
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

// const query = gql`
//   {
//     userLogin(email: "test@test.com") {
//       id
//       email
//     }
//   }
// `;

const Form = t.form.Form

export class Login extends Component {
  constructor() {
    super()
    this.state = {loading: false}
    this.login = this.login.bind(this)
  }

  componentDidMount() {}

  //this is what eric changed
  componentDidUpdate(prevProps) {
    if (this.props.user.id) {
      console.log('go home')
      this.props.navigation.navigate('Home')
    }
  }
  static navigationOptions = {
    drawerLabel: () => null
  }

  async login() {
    this.setState({loading: true})
    const values = this._form.getValue()
    console.log('TCL: values', values)

    try {
      this.props.getUser(values)
    } catch (error) {
      this.setState({loading: false})
      alert('COULD NOT LOGIN')
      console.log(error)
    }
  }

  render() {
    if (this.state.loading) {
      return <Spinner />
    }
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Form ref={c => (this._form = c)} type={User} options={options} />
          <TouchableOpacity onPress={this.login} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export const styles = StyleSheet.create({
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
    backgroundColor: 'black',
    padding: 10,
    margin: 15,
    alignItems: 'center',
    height: 40
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
