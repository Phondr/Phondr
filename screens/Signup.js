import React, {Component} from 'react'
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
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

import t, {MultiSelectExample} from 'tcomb-form-native'

// const Choices = {
//   Male: 'Male',
//   Female: 'Female',
//   NonBinary: 'Non-Binary'
// }

// const EnumChoices = t.enums(Choices, 'Choices')

const User = t.struct({
  fullName: t.String,
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
    fullName: {
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
      preferences: []
    }

    this.doitchecked1 = this.doitchecked1.bind(this)
    this.doitchecked2 = this.doitchecked2.bind(this)
    this.doitchecked3 = this.doitchecked3.bind(this)

    this.signup = this.signup.bind(this)
  }
  static navigationOptions = {
    drawerLabel: () => null
  }

  componentDidUpdate() {
    const user = this.props.user
    if (this.props.user.id) {
      this.props.navigation.navigate('Home', {user})
    }
  }

  async signup() {
    const values = this._form.getValue()
    const preferences = this.state.preferences
    //console.log(values)
    try {
      await this.props.addUser(values, preferences)
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
          <View styles={styles.checkboxcontainer}>
            <Header>
              <Left>
                <Title>Sign Up Form</Title>
              </Left>
            </Header>
            <Content>
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

          <CameraComponent />

          <TouchableOpacity style={styles.submitButton} onPress={this.signup}>
            <Text style={styles.submitButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    backgroundColor: '#343434'
  },
  checkboxcontainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#F5FCFF',
    flex: 1,
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
    backgroundColor: 'black',
    padding: 10,
    margin: 15,
    // alignItems: 'center',
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
  addUser: (values, preferences) => dispatch(userSignUp(values, preferences))
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
