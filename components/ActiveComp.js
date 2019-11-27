import React from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Card, CardItem, Text} from 'native-base'
import {withNavigation} from 'react-navigation'
import { setChat } from '../redux/currentChat'
const ActiveChats = ({myChats, user, setChat, navigation, preview}) => {
  const active = myChats.filter(chat => chat.status === 'active')
  console.log('active', active, 'user', user)
  return (
    <Card>
      <CardItem header>
        <Text>Active Chats</Text>
      </CardItem>

      {active.map(cur => {
        return (
          <CardItem
            button
            onPress={() => { setChat(cur); navigation.navigate('SingleChat')}}
            key={cur.id}
          >
            <Left>
              <Icon name="person" />
            </Left>
            <Text>
              {
                cur.users.find(u => {
                  console.log('u', u, 'chat id', cur.id)
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
  connect(({myChats, user}) => ({myChats, user}), {setChat})(ActiveChats)
)
