import React, {Component} from 'react'
import {
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView
} from 'react-native'
import {View} from 'native-base'
import t from 'tcomb-form-native'
import {connect} from 'react-redux'
import {fetchUserLogin} from '../redux/user'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {throwServerError} from 'apollo-link-http-common'
import {navigate, NavigationEvents} from 'react-navigation'
import Spinner from '../components/Spinner'
import _ from 'lodash'

const Form = t.form.Form
Form.stylesheet.textbox.normal.color = 'white';
Form.stylesheet.controlLabel.normal.color= 'white'
const User = t.struct({
  email: t.String,
  password: t.String
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
    }
  }
}

// const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

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
    return (
      <View style={{backgroundColor: '#343434', height:'100%'}}>
        <View style={{alignItems: 'center', backgroundColor: '#343434'}}>
          <Image
            style={{width: '90%', height: 150, marginTop: 40}}
            source={require('../assets/images/fog.jpg')}
            resizeMode="cover"
          />
        </View>
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
            <View style={{marginTop:20, style:'#343434'}}>
              <Form ref={c => (this._form = c)} type={User} options={options} />
              <TouchableOpacity
                onPress={this.login}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={{alignItems: 'center', backgroundColor: '#343434'}}>
          <Image
            style={{width: '90%', height: 160, marginTop: 10}}
            source={require('../assets/images/fog.jpg')}
            resizeMode="cover"
          />
        </View>
      </View>
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
    backgroundColor: '#343434'
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: 'black',
    borderWidth: 1
  },
  submitButton: {
    backgroundColor: '#E0115F',
    padding: 10,
    margin: 15,
    alignItems: 'center',
    height: 40,
    borderRadius: 30
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
