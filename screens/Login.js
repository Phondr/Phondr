import React, {Component} from 'react'
import {Text, View, StyleSheet, Button, TouchableOpacity} from 'react-native'
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

  componentDidMount() {
    console.log('LOGIN PROPS', this.props)
  }

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
    const values = this._form.getValue()
    console.log('TCL: values', values)

    try {
      this.props.getUser(values)
    } catch (error) {
      alert('COULD NOT LOGIN')
      console.log(error)
    }
  }

  render() {
    return (
      <View styles={{padding: 30, margin: 50}}>
          <Form
            ref={c => (this._form = c)}
            type={User}
            options={options}
            style={styles.formcontainer}
          />

          <TouchableOpacity style={styles.submitButton} onPress={this.login}>
            <Text style={styles.submitButtonText}>Login</Text>
          </TouchableOpacity>

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

export const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: 'center',
    // alignItems: "center",
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
  }
})

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  getUser: values => dispatch(fetchUserLogin(values))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
