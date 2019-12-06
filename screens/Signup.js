import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native'
import {
  Container,
  Content,
  Text,
  Picker,
  Header,
  Title,
  Button,
  CheckBox,
  ListItem,
  Body,
  Left,
  Right,
  Dimensions
} from 'native-base'
import {connect} from 'react-redux'
import {userSignUp} from '../redux/user'
import CameraComponent from './CameraComponent'
import Geocoder from 'react-native-geocoding'
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'

import t, {MultiSelectExample} from 'tcomb-form-native'

// const Choices = {
//   Male: 'Male',
//   Female: 'Female',
//   NonBinary: 'Non-Binary'
// }

// const EnumChoices = t.enums(Choices, 'Choices')

const User = t.struct({
  name: t.String,
  age: t.Integer,
  //address: t.String,
  radius: t.Integer,
  gender: t.String,
  email: t.String,
  password: t.String
  //choices: EnumChoices
})

const options = {
  fields: {
    name: {
      error: 'You need your fullname to sign up'
    },
    age: {
      error: 'You need a valid age to sign up'
    },
    // address: {
    //   error: 'You need a valid address to sign up'
    // },
    radius: {
      placeholder: 'miles',
      error: 'You need to specify a search radius(in miles)'
    },
    gender: {
      placeholder: 'male, female, non-binary',
      error: 'You need to specify a proper gender to sign up'
    },
    email: {
      error: 'You need a valid email to sign up'
    },
    password: {
      password: true,
      secureTextEntry: true,
      error: 'You need a valid password to sign up'
    }
    // choices: {
    //   label: 'Preference',
    //   choices: Choices,
    //   factory: MultiSelectExample
    // }
  }
}

const Form = t.form.Form

export class Signup extends Component {
  constructor() {
    super()
    this.state = {
      checked1: false,
      checked2: false,
      checked3: false,
      preferences: [],
      location: null,
      errorMessage: null,
      address: []
    }

    this.doitchecked1 = this.doitchecked1.bind(this)
    this.doitchecked2 = this.doitchecked2.bind(this)
    this.doitchecked3 = this.doitchecked3.bind(this)

    this.signup = this.signup.bind(this)
  }
  static navigationOptions = {
    drawerLabel: () => null
  }

  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage:
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      })
    } else {
      this._getLocationAsync()
    }
  }

  _getLocationAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      })
    }

    let location = await Location.getCurrentPositionAsync({})
    this.setState({location})

    let text = 'Waiting..'
    let lat = ''
    let lon = ''
    const address = []
    if (this.state.errorMessage) {
      text = this.state.errorMessage
    } else if (this.state.location) {
      text = this.state.location
      address.push(this.state.location.coords.latitude)
      address.push(this.state.location.coords.longitude)

      this.setState({address})

      console.log('ADDRESS', this.state.address)
    }
  }

  async signup() {
    const values = this._form.getValue()
    const preferences = this.state.preferences
    const address = this.state.address
    const user = {values, preferences, address}
    //console.log(values)
    try {
      //send to camera with
      //await this.props.addUser(values, preferences)
      this.props.navigation.navigate('LoginCamera', {user})
    } catch (error) {
      alert('COULD NOT SIGNUP')
      console.log(error)
    }
  }

  doitchecked1() {
    this.setState({checked1: !this.state.checked1})
    this.state.checked1 === false
      ? this.setState({preferences: [...this.state.preferences, 'male']})
      : this.setState({
          preferences: this.state.preferences.filter(pref => pref !== 'male')
        })
  }

  doitchecked2() {
    this.setState({checked2: !this.state.checked2})
    this.state.checked2 === false
      ? this.setState({preferences: [...this.state.preferences, 'female']})
      : this.setState({
          preferences: this.state.preferences.filter(pref => pref !== 'female')
        })
  }

  doitchecked3() {
    this.setState({checked3: !this.state.checked3})
    this.state.checked3 === false
      ? this.setState({preferences: [...this.state.preferences, 'non-binary']})
      : this.setState({
          preferences: this.state.preferences.filter(
            pref => pref !== 'non-binary'
          )
        })
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          {/* <View style={styles.locationcontainer}>
            <Text style={styles.paragraph}>{text}</Text>
          </View> */}
          <View styles={styles.checkboxcontainer}>
            <Header>
              <Left>
                <Title>Gender Preference</Title>
              </Left>
            </Header>
            <Content style={styles.checkboxcontent}>
              <ListItem>
                <CheckBox
                  checked={this.state.checked1}
                  color="blue"
                  onPress={() => {
                    this.doitchecked1()
                  }}
                ></CheckBox>

                <Body>
                  <Text>Male</Text>
                </Body>
              </ListItem>
              <ListItem>
                <CheckBox
                  checked={this.state.checked2}
                  color="pink"
                  onPress={() => {
                    this.doitchecked2()
                  }}
                ></CheckBox>
                <Body>
                  <Text>Female</Text>
                </Body>
              </ListItem>
              <ListItem>
                <CheckBox
                  checked={this.state.checked3}
                  color="purple"
                  onPress={() => {
                    this.doitchecked3()
                  }}
                ></CheckBox>
                <Body>
                  <Text>Non-Binary</Text>
                </Body>
              </ListItem>
            </Content>
          </View>
          <Form
            ref={c => (this._form = c)}
            type={User}
            options={options}
            style={styles.formcontainer}
          />

          {/* <CameraComponent /> */}
          <TouchableOpacity style={styles.submitButton} onPress={this.signup}>
            <Text style={styles.submitButtonText}>Proceed to Photo</Text>
          </TouchableOpacity>
        </View>
        {Platform.OS === 'android' && (
          <KeyboardAvoidingView behavior="padding" />
        )}
      </ScrollView>
    )
  }
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    padding: 20,
    backgroundColor: '#F5FCFF'
  },
  checkboxcontainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#F5FCFF',
    flex: 1,
    margin: 10
  },
  checkboxcontent: {
    padding: 10,
    margin: 10
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
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center'
  },
  locationcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1'
  }
})

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  addUser: (values, preferences) => dispatch(userSignUp(values, preferences))
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
