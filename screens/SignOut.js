import React, {Component} from 'react'
import {AsyncStorage} from 'react-native'
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'
import {Container, Button, Icon, Content, Left, Right} from 'native-base'
import {NavigationEvents} from 'react-navigation'
import {connect} from 'react-redux'
import {setUser} from '../redux/user'

export class SignOut extends Component {
  static navigationOptions = {
    drawerIcon: ({tintColor}) => {
      return <Icon name="home" style={{fontSize: 24, color: tintColor}}></Icon>
    }
  }

  render() {
    return (
      <View>
        <NavigationEvents
          onDidFocus={async payload => {
            try {
              await AsyncStorage.removeItem('userKey')
              this.props.setUser({})
              this.props.navigation.navigate('notLoggedIn')
              console.log('REMOVED KEY')
            } catch (e) {
              // error reading value
              console.log('COULD NOT REMOVE ASYNC STORAGE KEY ON SIGNOUT', e)
            }
          }}
        />
      </View>
    )
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    setUser: user => dispatch(setUser(user))
  }
}

export default connect(null, mapDispatchToProps)(SignOut)
