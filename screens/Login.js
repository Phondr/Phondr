import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, AsyncStorage } from 'react-native'
import t from 'tcomb-form-native'
import { connect } from 'react-redux'
import { fetchUserLogin } from '../client/redux/user'
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

export class Login extends Component {
  constructor() {
    super()

    this.login = this.login.bind(this)
  }
  static navigationOptions = {
    drawerLabel: () => null,
  }

  async login() {
    const values = this._form.getValue()
    try {
      let data = await this.props.getUser(values)
      if (data.fullName) {
        this.props.navigation.navigate('Home')
      }
    } catch (error) {
      alert('COULD NOT LOGIN')
      console.log(error)
    }
  }

  render() {
    return (
      <View styles={styles.container}>
        <View>
          <Form
            ref={c => (this._form = c)}
            type={User}
            options={options}
            style={styles.formcontainer}
          />

          <Button title='Submit' onPress={this.login} />
          {/* <Query query={query}>
            {({ loading, error, data }) => {
              // console.log("loading", loading);
              // console.log("error", error);
              console.log(data);
              return <Text>hiiii</Text>;
            }}
          </Query> */}
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
    backgroundColor: '#F5FCFF',
  },
  phonderimage: {
    width: 200,
    height: 200,
    position: 'relative',
    justifyContent: 'center',
  },
  textInput: {
    //borderBottomColor: "#CCCCCC",
    // borderTopWidth: 1,
    //borderBottomWidth: 1,
    // height: 50,
    // width: 400,
    // fontSize: 25,
    // paddingLeft: 10,
    // paddingRight: 10,
    // textAlign: "center",
    // margin: 5
  },
  logintext: {
    margin: 2,
    fontSize: 30,
  },
  formcontainer: {
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#ffffff',
  },
})

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  getUser: values => dispatch(fetchUserLogin(values)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
