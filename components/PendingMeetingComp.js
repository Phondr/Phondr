import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Body, Right, Card, CardItem, Text} from 'native-base'
import {withNavigation, NavigationEvents} from 'react-navigation'
import {setChat, fetchCurrentChat} from '../redux/currentChat'
import ProgressBar from './ProgressBar'
import {fetchAllMeetings} from '../redux/meetings'

const PendingMeetingComp = ({
  user,
  meetings,
  fetchAllMeetings,
  navigation,
  setChat,
  fetchCurrentChat
}) => {
  const pending = meetings.filter(meeting => meeting.status === 'pending')

  // useEffect(() => {
  //   navigation.addListener('didFocus', () => {
  //     if (user && user.id) {
  //       fetchMyChats(user.id)
  //     }
  //   })
  // }, [])
  // useEffect(() => {
  //   fetchAllMeetings(user.id)
  // }, [])
  return (
    <Card>
      <NavigationEvents
        onWillFocus={payload => {
          fetchAllMeetings(user.id)
        }}
      />
      <CardItem header>
        <Text>Pending Meetings</Text>
      </CardItem>

      {pending.map(cur => {
        return (
          <CardItem
            button
            onPress={async () => {
              await fetchCurrentChat(cur.chat.id)
              navigation.navigate('SingleChat')
            }}
            key={cur.id}
          >
            <Left>
              <Icon name={'place'} type={'MaterialIcons'} />
            </Left>
            <Body>
              <Text>
                Name: {cur.name} {'\n'}
                Address: {cur.address} {'\n'}
                Date: {cur.date.toString()} {'\n'}
                Map Link: {cur.link}
              </Text>
            </Body>
            <Right>
              <Text>
                {
                  cur.users.find(u => {
                    return u.fullName !== user.fullName
                  }).fullName
                }
              </Text>
            </Right>
          </CardItem>
        )
      })}
    </Card>
  )
}

export default withNavigation(
  connect(({meetings, user}) => ({meetings, user}), {
    fetchAllMeetings,
    setChat,
    fetchCurrentChat
  })(PendingMeetingComp)
)
