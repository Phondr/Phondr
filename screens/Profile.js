import React, {Component} from 'react'
import {Icon, View} from 'native-base'
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView
} from 'react-native'
import {connect} from 'react-redux'
import {fetchUserFromAsync} from '../redux/user'
import CustomHeader from '../components/CustomHeader'

export class Profile extends Component {
  constructor() {
    super()
    this.state = {
      user: ''
    }
  }

  static navigationOptions = {
    drawerIcon: ({tintColor}) => {
      return (
        <Icon name="person" style={{fontSize: 24, color: tintColor}}></Icon>
      )
    }
  }

  async componentDidMount() {
    try {
      await this.props.getUser()
    } catch (error) {
      alert('COULD NOT LOGIN')
      console.log(error)
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      try {
        await this.props.getUser()
      } catch (error) {
        alert('COULD NOT GET USER AFTER EDITING')
        console.log(error)
      }
    }
  }

  render() {
    const user = this.props.user
    console.log('USER', user)
    return (
      <ScrollView style={{backgroundColor:'#FC89AC'}}>
        <StatusBar barStyle="light-content" />
        <CustomHeader title="Profile" />
        <View style={styles.header}></View>
        <Image style={styles.avatar} source={{uri: user.profilePicture}} />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.info}>
              {user.iAm} | {user.age}
            </Text>
            <View style={styles.bodyDescription}>
              <Text style={styles.description}>Email: {user.email}</Text>
              <Text style={styles.description}>
                Location: {user.homeLocation}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                this.props.navigation.navigate('UserProfileEdit', {user})
              }}
            >
              <Text style={{color:'white'}}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#DE6FA1',
    height: 200
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  body: {
    marginTop: 40,
    backgroundColor:'#FC89AC'
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 28
  },
  name: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600'
  },
  info: {
    fontSize: 15,
    color: '#696969',
    marginTop: 10
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#696969',
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  bodyDescription: {
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
    color: '#696969',
    margin: 10,
    justifyContent: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#FF2400'
  }
})

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  getUser: () => dispatch(fetchUserFromAsync())
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
