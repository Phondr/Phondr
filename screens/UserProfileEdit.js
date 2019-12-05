import React, {Component} from 'react'
import {View, Icon, Form, Input, Item, Right} from 'native-base'
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions
} from 'react-native'
import CustomHeader from '../components/CustomHeader'
import {EditUser, fetchUserFromAsync} from '../redux/user'
import {connect} from 'react-redux'

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
      iAmswitch: false
    }
    this.submitHandler = this.submitHandler.bind(this)
  }

  static navigationOptions = {
    drawerLabel: () => null
  }

  async componentDidMount() {
    try {
      await this.props.getUser()
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

  render() {
    const user = this.props.user || {}
    return (
      <ScrollView style={styles.container}>
        <CustomHeader title="Profile" />
        <StatusBar barStyle="light-content" />
        <View style={styles.header}></View>
        <Image
          style={styles.avatar}
          source={{uri: this.props.navigation.state.params.user.profilePicture}}
        />

        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <View style={styles.bodyDescription}>
              <Form >
                {!this.state.fullnameswitch ? (
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => {
                      this.setState({fullName: '', fullnameswitch: true})
                    }}
                  >
                    <Text style={{color: 'white'}}>Edit Name</Text>
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
                    style={styles.buttonContainer}
                    onPress={() => {
                      this.setState({distPref: '', distPrefswitch: true})
                    }}
                  >
                    <Text style={{color: 'white'}}>Edit Distance Prefered</Text>
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
                    style={styles.buttonContainer}
                    onPress={() => {
                      this.setState({email: '', emailswitch: true})
                    }}
                  >
                    <Text style={{color: 'white'}}>Edit Email</Text>
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
                    style={styles.buttonContainer}
                    onPress={() => {
                      this.setState({iAm: '', iAmswitch: true})
                    }}
                  >
                    <Text style={{color: 'white'}}>Edit Gender</Text>
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
              </Form>
              <View style={{width:200,backgroundColor:'#E0115F', marginTop:10}}>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={this.submitHandler}
                >
                  <Text style={{color: 'white'}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginBottom: 20,
    // paddingBottom: 20,
    backgroundColor: '#FC89AC'
  },
  header: {
    backgroundColor: '#DE6FA1',
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
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  body: {
    marginTop: 5,
    backgroundColor: '#FC89AC'
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  name: {
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
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#E0115F',
    marginTop:10
  },
  input: {
    borderWidth: 1,
    width: '60%',
    borderColor: 'grey',
    borderRadius: 10
  },
  inputItem: {
    width: Dimensions.get('window').width
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
