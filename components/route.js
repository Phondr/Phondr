import {createAppContainer, createStackNavigator} from 'react-navigation'
import React from 'react'
import { View, Text, Button } from 'native-base'
import AllChats from './Allchat'
import Profile from './Profile'
import MapView from './MapView'
import Meetview from './Meetview'
import Sendmeetings from './Sendmeeting'
import SingleChats from './SingleChat'
class Stack extends React.Component{
  render(){
    return(
      <View>
        <Button  onPress={()=>{this.props.navigation.navigate('allchat')}}><Text>allchat</Text></Button>
        <Button  onPress={()=>{this.props.navigation.navigate('profile')}}><Text>profile</Text></Button>
        <Button  onPress={()=>{this.props.navigation.navigate('mapview')}}><Text>mapview</Text></Button>
        <Button  onPress={()=>{this.props.navigation.navigate('meetview')}}><Text>meetview</Text></Button>
        <Button onPress={()=>{this.props.navigation.navigate('sendmeeting')}}><Text>sendmeeting</Text></Button>
        <Button onPress={()=>{this.props.navigation.navigate('singlechat')}}><Text>singlechat</Text></Button>
      </View>
    )
  }
}
const Temp = createStackNavigator({
  stack:{
    screen:Stack
  },
  allchat: {
    screen: AllChats
  },
  profile: {
    screen: Profile
  },
  mapview: {
    screen:MapView
  },
  meetview: {
    screen:Meetview
  },
  sendmeeting:{
    screen:Sendmeetings
  },
  singlechat: {
    screen:SingleChats
  }
})
export const New = createAppContainer(Temp)
