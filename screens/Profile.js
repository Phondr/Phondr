import React, {Component} from 'react'
import {Icon, View} from 'native-base'
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {fetchUserFromAsync} from '../redux/user'
import CustomHeader from '../components/CustomHeader'
import Geocoder from 'react-native-geocoding'
const {placesAPI} = require('../secrets')
import {LinearGradient} from 'expo-linear-gradient'
import axios from 'axios'
import Spinner from '../components/Spinner'
import * as Font from 'expo-font'

export class Profile extends Component {
  constructor() {
    super()
    this.state = {
      user: '',
      address: '',
      fontsLoaded: false
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
      this.setState({loading: false})
      await Font.loadAsync({
        lobster: require('../assets/fonts/Lobster/Lobster-Regular.ttf')
      })
      this.setState({fontsLoaded: true})
    } catch (error) {
      alert('COULD NOT LOGIN')
      console.log(error)
    }

    const {data} = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.props.user.homeLocation[0]},${this.props.user.homeLocation[1]}&key=${placesAPI}`
    )

    //console.log('LOCATION', data.results[0].formatted_address)
    const address = data.results[0].formatted_address
    this.setState({address})
  }

  // async componentDidUpdate(prevProps) {
  //   if (prevProps.user !== this.props.user && this.props.user.id) {
  //     try {
  //       this.setState({loading: true})
  //       await this.props.getUser()
  //       this.setState({loading: false})
  //     } catch (error) {
  //       alert('COULD NOT GET USER AFTER EDITING')
  //       console.log(error)
  //     }
  //   }
  // }

  render() {
    const user = this.props.user
    //console.log('USER', user)
    if (this.state.fontsLoaded) {
      return (
        <View style={styles.topcontainer}>
          <ScrollView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <CustomHeader title="Profile" />
            <View style={styles.header}>
              <LinearGradient
                colors={['#fb9fd9', '#60dee7', '#75c6e5']}
                style={styles.header}
              ></LinearGradient>
            </View>
            <Image
              style={
                Dimensions.get('window').height >= 812
                  ? styles.avatarMike
                  : styles.avatar
              }
              source={{uri: user.profilePicture}}
            />
            <View style={styles.body}>
              <View style={styles.bodyContent}>
                <Text style={styles.name}>{user.fullName}</Text>
                <Text style={styles.info}>
                  {user.iAm} | {user.age}
                </Text>
                <View style={styles.bodyDescription}>
                  <Text style={styles.description}>Email: {user.email}</Text>
                  <Text style={styles.description}>
                    Location: {this.state.address}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('UserProfileEdit', {user})
            }}
          >
            <LinearGradient
              colors={['#60dee7', '#75c6e5']}
              style={styles.submitButton}
            >
              <Text
                style={{color: 'white', fontFamily: 'lobster', fontSize: 20}}
              >
                Edit
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    } else {
      return <Spinner />
    }
  }
}

const styles = StyleSheet.create({
  topcontainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF'
  },
  header: {
    backgroundColor: '#00BFFF',
    height: 200
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 75
  },
  avatarMike: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 100
  },
  name: {
    fontSize: 22,
    // color: '#FFFFFF',
    fontWeight: '600'
  },
  body: {
    marginTop: 40
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 28
  },
  name2: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600'
  },
  info: {
    fontSize: 15,
    color: '#00BFFF',
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
    borderRadius: 20,
    backgroundColor: '#00BFFF'
  },
  submitButton: {
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    flexDirection: 'row',
    width: Dimensions.get('window').width
  }
})

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  getUser: () => dispatch(fetchUserFromAsync())
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
