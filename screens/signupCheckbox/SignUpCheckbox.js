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
  Body
} from 'native-base'

export default class SignUpCheckbox extends Component {
  constructor() {
    super()
    this.state = {
      checked1: false,
      checked2: false,
      checked3: false,
      preferences: []
    }
    //console.log(this.state)
    this.doitchecked1 = this.doitchecked1.bind(this)
    this.doitchecked2 = this.doitchecked2.bind(this)
    this.doitchecked3 = this.doitchecked3.bind(this)
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
      <Container>
        <Header />
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
      </Container>
    )
  }
}
