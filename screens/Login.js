import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native'
import t from 'tcomb-form-native'
import {connect} from 'react-redux'
import {fetchUserLogin} from '../redux/user'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {throwServerError} from 'apollo-link-http-common'
import {navigate} from 'react-navigation'

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
    this.login = this.login.bind(this)
  }

  componentDidUpdate() {
    const user = this.props.user
    if (this.props.user.id) {
      this.props.navigation.navigate('Home', {user})
    }
  }

  static navigationOptions = {
    drawerLabel: () => null
  }

  async login() {
    const values = this._form.getValue()
    try {
      await this.props.getUser(values)
    } catch (error) {
      alert('COULD NOT LOGIN')
      console.log(error)
    }
  }

  render() {
    return (
      <ScrollView>
        <View styles={styles.container}>
          <Form
            ref={c => (this._form = c)}
            type={User}
            options={options}
            style={styles.formcontainer}
          />
          <TouchableOpacity style={styles.submitButton} onPress={this.login}>
            <Text style={styles.submitButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

export const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 30,
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    backgroundColor: '#F5FCFF'
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
  formcontainer: {
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#ffffff'
  }
})

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  getUser: values => dispatch(fetchUserLogin(values))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
