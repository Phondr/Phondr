import React from 'react'
import {connect} from 'react-redux'
import {
  Container,
  Button,
  H3,
  Icon,
  Header,
  Content,
  Left,
  Body,
  Right,
  Card,
  CardItem,
  Text
} from 'native-base'
const ActiveChats = ({myChats, user}) => {
  const active = myChats.filter(chat => chat.status === 'active')
  console.log('active', active, 'user', user)
  return (
    <Card>
      <CardItem header>
        <Text>Active Chats</Text>
      </CardItem>

      {active.map(cur => {
        return (
          <CardItem key={cur.id}>
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

export default connect(({myChats}) => ({myChats}))(ActiveChats)
