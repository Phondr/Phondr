import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Card, CardItem, Text} from 'native-base'
import {
  withNavigation,
  NavigationEvents,
  NavigationActions
} from 'react-navigation'
import {setChat} from '../redux/currentChat'
import ProgressBar from './ProgressBar'
import {fetchMyChats} from '../redux/myChats'
const ActiveChats = ({
  myChats,
  user,
  setChat,
  fetchMyChats,
  navigation,
  preview
}) => {
  const active = myChats.filter(chat => chat.status === 'active')

  return (
    <Card>
      <NavigationEvents
        onWillFocus={payload => {
          fetchMyChats(user.id)
        }}
      />
      <CardItem header>
        <Text>Active Chats</Text>
      </CardItem>

      {active.map(cur => {
        return (
          <CardItem
            button
            onPress={() => {
              setChat(cur)
              if (preview) {
                navigation.navigate(
                  NavigationActions.navigate({
                    routeName: 'Chats',
                    action: NavigationActions.navigate(
                      NavigationActions.navigate({
                        routeName: 'Active',
                        action: NavigationActions.navigate({
                          routeName: 'SingleChat',
                          action: navigation.navigate('SingleChat')
                        })
                      })
                    )
                  })
                )
              } else {
                navigation.navigate('SingleChat')
              }
            }}
            key={cur.id}
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
