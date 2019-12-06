import React, {Component} from 'react'
import {View, Icon, Form, Input, Item, Right} from 'native-base'
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView
} from 'react-native'
import CustomHeader from '../components/CustomHeader'
import {EditUser, fetchUserFromAsync} from '../redux/user'
import {connect} from 'react-redux'
import {NavigationEvents} from 'react-navigation'
import {LinearGradient} from 'expo-linear-gradient'
import Spinner from '../components/Spinner'
import * as Font from 'expo-font'

export class UserProfileEdit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fullName: props.navigation.state.params.user.fullName,
      email: props.navigation.state.params.user.email,
      age: props.navigation.state.params.user.age,
      distPref: props.navigation.state.params.user.distPref,
      iAm: props.navigation.state.params.user.iAm,
      iPrefer: [],
      fullnameswitch: false,
      emailswitch: false,
      ageswitch: false,
      distPrefswitch: false,
      iAmswitch: false,
      fontsLoaded: false
    }
    this.submitHandler = this.submitHandler.bind(this)
    this.resetBooleans = this.resetBooleans.bind(this)
  }

  static navigationOptions = {
    drawerLabel: () => null
  }

  async componentDidMount() {
    try {
      await this.props.getUser()
      await Font.loadAsync({
        lobster: require('../assets/fonts/Lobster/Lobster-Regular.ttf')
      })
      this.setState({fontsLoaded: true})
    } catch (error) {
      alert('COULD NOT GET USER FOR EDITING')
      console.log(error)
    }
  }

  async submitHandler() {
    const newuserdata = this.state
    const userId = this.props.navigation.state.params.user.id

    //mutation

    let user = await this.props.edit(newuserdata, userId)
    if (user !== null) {
      const userguy = this.props.user
      this.props.navigation.navigate('Profile', {userguy})
    }
  }
  resetBooleans() {
    this.setState({
      fullnameswitch: false,
      emailswitch: false,
      ageswitch: false,
      distPrefswitch: false,
      iAmswitch: false
    })
  }
  render() {
    const user = this.props.user || {}
    if (this.state.fontsLoaded) {
      return (
        <View style={styles.topcontainer}>
          <ScrollView style={styles.container}>
            <NavigationEvents onWillFocus={this.resetBooleans} />
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
              source={{
                uri: this.props.navigation.state.params.user.profilePicture
              }}
            />

            <View style={styles.body}>
              <View style={styles.bodyContent}>
                <View style={styles.bodyDescription}>
                  <Form style={styles.formAlign}>
                    {/* <View style={styles.formAlign}> */}

                    {!this.state.fullnameswitch ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({fullName: '', fullnameswitch: true})
                        }}
                      >
                        <LinearGradient
                          colors={['#60dee7', '#75c6e5']}
                          style={styles.buttonContainer}
                        >
                          <Text style={{color: 'white'}}>Edit Name</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      <Item>
                        <Input
                          placeholder={`Full Name: (Previously: ${this.props.navigation.state.params.user.fullName})`}
                          name="fullName"
                          style={styles.input}
                          onChangeText={fullName => {
                            this.setState({fullName})
                          }}
                          value={this.state.fullName}
                        />
                      </Item>
                    )}

                    {!this.state.distPrefswitch ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({distPref: '', distPrefswitch: true})
                        }}
                      >
                        <LinearGradient
                          colors={['#60dee7', '#75c6e5']}
                          style={styles.buttonContainer}
                        >
                          <Text style={{color: 'white'}}>
                            Edit Distance Prefered
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      <Item>
                        <Input
                          placeholder={`Distance Prefered: (Previously: ${this.props.navigation.state.params.user.distPref})`}
                          style={styles.input}
                          onChangeText={distPref => {
                            this.setState({distPref})
                          }}
                          value={this.state.distPref}
                          name="distPref"
                        />
                      </Item>
                    )}

                    {!this.state.emailswitch ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({email: '', emailswitch: true})
                        }}
                      >
                        <LinearGradient
                          colors={['#60dee7', '#75c6e5']}
                          style={styles.buttonContainer}
                        >
                          <Text style={{color: 'white'}}>Edit Email</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      <Item>
                        <Input
                          placeholder={`Email: (Previously: ${this.props.navigation.state.params.user.email})`}
                          name="email"
                          style={styles.input}
                          onChangeText={email => {
                            this.setState({email})
                          }}
                          value={this.state.email}
                        />
                      </Item>
                    )}

                    {!this.state.iAmswitch ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({iAm: '', iAmswitch: true})
                        }}
                      >
                        <LinearGradient
                          colors={['#60dee7', '#75c6e5']}
                          style={styles.buttonContainer}
                        >
                          <Text style={{color: 'white'}}>Edit Gender</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      <Item>
                        <Input
                          placeholder={`I Identify As: (Previously: ${this.props.navigation.state.params.user.iAm})`}
                          style={styles.input}
                          onChangeText={iAm => {
                            this.setState({iAm})
                          }}
                          value={this.state.iAm}
                          name="iAm"
                        />
                      </Item>
                    )}

                    {/* </View> */}
                  </Form>
                </View>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity onPress={this.submitHandler}>
            <LinearGradient
              colors={['#60dee7', '#75c6e5']}
              style={styles.submitButton}
            >
              <Text
                style={{color: 'white', fontFamily: 'lobster', fontSize: 20}}
              >
                Save
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {Platform.OS === 'android' && (
            <KeyboardAvoidingView behavior="padding" />
          )}
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
  submitButton: {
    backgroundColor: '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    flexDirection: 'row',
    width: Dimensions.get('window').width
  },
  container: {
    flex: 1,

    marginBottom: 20,
    paddingBottom: 20,
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
    color: '#FFFFFF',
    fontWeight: '600'
  },
  body: {
    marginTop: 5
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 10
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
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    borderRadius: 20,
    backgroundColor: '#00BFFF'
  },
  input: {
    borderWidth: 1,
    width: '60%',
    borderColor: 'grey',
    borderRadius: 10
  },
  inputItem: {
    width: Dimensions.get('window').width
  },
  formAlign: {
    flex: 1,
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  edit: (user, userId) => dispatch(EditUser(user, userId)),
  getUser: () => dispatch(fetchUserFromAsync())
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileEdit)
