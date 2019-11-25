import React, {Component} from 'react'
import {Text, View, StyleSheet, Button, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {userSignUp} from '../redux/user'

import t from 'tcomb-form-native'

const User = t.struct({
  fullname: t.String,
  age: t.Integer,
  address: t.String,
  email: t.String,
  password: t.String
})

const options = {
  fields: {
    fullname: {
      error: 'You need your fullname to sign up'
    },
    age: {
      error: 'You need a valid age to sign up'
    },
    address: {
      error: 'You need a valid address to sign up'
    },
    email: {
      error: 'You need a valid email to sign up'
    },
    password: {
      password: true,
      secureTextEntry: true,
      error: 'You need a valid password to sign up'
    }
  }
}

const Form = t.form.Form

export class Signup extends Component {
  constructor() {
    super()

    this.signup = this.signup.bind(this)
  }

  async signup() {
    const values = this._form.getValue()
    try {
      await this.props.addUser(values)
    } catch (error) {
      alert('COULD NOT SIGNUP')
      console.log(error)
    }
  }

  render() {
    console.log('In Sign Up')
    return (
      <View style={styles.container}>
        <View>
          <Form
            ref={c => (this._form = c)}
            type={User}
            options={options}
            style={styles.formcontainer}
          />
          <TouchableOpacity style={styles.submitButton} onPress={this.signup}>
            <Text style={styles.submitButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    padding: 10,
    backgroundColor: '#F5FCFF'
  },
  phonderimage: {
    width: 200,
    height: 200,
    position: 'relative',
    justifyContent: 'center'
  },
  logintext: {
    margin: 2,
    fontSize: 30
  },
  formcontainer: {
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#ffffff'
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
  }
})

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  addUser: values => dispatch(userSignUp(values))
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
