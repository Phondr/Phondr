import React, {Component} from 'react'
import {Text, View, StyleSheet, Image, Button} from 'react-native'
import {navigation} from 'react-navigation'
import Login from './Login'
import Signup from './Signup'
// import mainimage from "../assets/Images/PhondrLogos/EntryLogo/Phondr.png";
// const image = {
//   entryimage: require("../assets/Images/PhondrLogos/EntryLogo/Phondr.png")
// };

export class Entry extends Component {
 gotToLogin() {
  this.props.navigation.navigate('Login')
 }

 goToSignUp() {
  console.log('navigate to signup')
  this.props.navigation.navigate('Signup')
 }

 render() {
  return (
   <View style={styles.container}>
    <View style={styles.title}>
     <Image
      style={styles.phonderimage}
      source={{
       uri:
        'https://github.com/Phondr/Phondr/blob/login/assets/images/PhondrLogos/PhondrLarge.png?raw=true'
      }}
     />
    </View>
    <Button
     title="Login"
     onPress={() => {
      this.gotToLogin()
     }}
    />
    <Button
     title="Sign Up"
     onPress={() => {
      this.goToSignUp()
     }}
    />
   </View>
  )
 }
}

export const styles = StyleSheet.create({
 container: {
  flex: 1,
  paddingTop: 25,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5FCFF'
 },
 phonderimage: {
  width: 350,
  height: 350,
  position: 'relative',
  justifyContent: 'center'
 },
 textInput: {
  //borderBottomColor: "#CCCCCC",
  // borderTopWidth: 1,
  //borderBottomWidth: 1,
  // height: 50,
  // width: 400,
  // fontSize: 25,
  // paddingLeft: 10,
  // paddingRight: 10,
  // textAlign: "center",
  // margin: 5
 },
 logintext: {
  margin: 2,
  fontSize: 30
 },
 formcontainer: {
  justifyContent: 'center',
  marginTop: 50,
  padding: 20,
  margin: 10,
  backgroundColor: '#ffffff'
 }
})

export default Entry
