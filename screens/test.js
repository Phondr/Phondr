import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native'
import t from 'tcomb-form-native'
import { connect } from 'react-redux'
import { fetchUserLogin } from '../redux/user'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { throwServerError } from 'apollo-link-http-common'
import { navigate } from 'react-navigation'

const User = t.struct({
  email: t.String,
  password: t.String,
})

const options = {
  fields: {
    email: {
      error: 'You need a valid email to login to your account',
    },
    password: {
      password: true,
      secureTextEntry: true,
      error: 'You need a valid password to login to your account',
    },
  },
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

export class Test extends React.Component {
  constructor() {
    super()
    this.login = this.login.bind(this)
  }

  componentDidMount() {
    console.log('LOGIN PROPS', this.props)
  }

  static navigationOptions = {
    drawerLabel: () => null,
  }

  async login() {
    const values = this._form.getValue()
    try {
      await this.props.getUser(values)
      const user = this.props.user
      if (user.fullName) {
        console.log('go home')
        this.props.navigation.navigate('Home')
      }
    } catch (error) {
      alert('COULD NOT LOGIN')
      console.log(error)
    }
  }

  render() {
    return (
      <View >
        <Text>hiiii</Text>
          {/* <Form
            ref={c => (this._form = c)}
            type={User}
            options={options}
            // style={styles.formcontainer}
          />

          <TouchableOpacity  onPress={this.login}>
            <Text >Login</Text>
          </TouchableOpacity> */}

          {/* <Query query={query}>
            {({ loading, error, data }) => {
              // console.log("loading", loading);
              // console.log("error", error);
              console.log(data);
              return <Text>hiiii</Text>;
            }}
          </Query> */}
      </View>
    )
  }
}