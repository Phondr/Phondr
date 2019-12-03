import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Card, CardItem, Text} from 'native-base'
import {withNavigation, NavigationEvents} from 'react-navigation'
import {setChat} from '../redux/currentChat'
import ProgressBar from './ProgressBar'
import {fetchMyChats} from '../redux/myChats'
const ActiveChats = ({myChats, user, setChat, fetchMyChats, navigation}) => {
  const active = myChats.filter(chat => chat.status === 'active')

  // useEffect(() => {
  //   navigation.addListener('didFocus', () => {
  //     if (user && user.id) {
  //       fetchMyChats(user.id)
  //     }
  //   })
  // }, [])
  return (
    <Card >
      <NavigationEvents
        onWillFocus={payload => {
          fetchMyChats(user.id)
        }}
      />
      <CardItem header style={{backgroundColor:'#E0115F'}}>
        <Text>Active Chats</Text>
      </CardItem>

      {active.map(cur => {
        return (
          <CardItem
            button
            onPress={() => {
              setChat(cur)
              navigation.navigate('SingleChat')
            }}
            key={cur.id}
            style={{backgroundColor:'#FF91AF'}}
          >
            <ProgressBar currentChat={cur} />
            <Left>
              <Icon name="person" />
            </Left>
            <Text>
              {
                cur.users.find(u => {
                  return u.fullName !== user.fullName
                }).fullName
              }
            </Text>
          </CardItem>
        )
      })}
    </Card>
  )
}

export default withNavigation(
  connect(({myChats, user}) => ({myChats, user}), {setChat, fetchMyChats})(
    ActiveChats
  )
)
