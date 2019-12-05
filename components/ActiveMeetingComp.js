import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Body, Right, Card, CardItem, Text, Image} from 'native-base'
import {withNavigation, NavigationEvents} from 'react-navigation'
import {setChat, fetchCurrentChat} from '../redux/currentChat'
import ProgressBar from './ProgressBar'
import {fetchAllMeetings} from '../redux/meetings'

const ActiveMeetingComp = ({
  user,
  meetings,
  fetchAllMeetings,
  navigation,
  setChat,
  fetchCurrentChat
}) => {
  const active = meetings.filter(meeting => meeting.status === 'active')

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
        <Text>Active Meetings</Text>
      </CardItem>

      {active.map(cur => {
        return (
          <React.Fragment key={cur.id}>
            <CardItem>
              <Text style={{color: 'blue'}}>Name: {cur.name}</Text>
            </CardItem>
            <CardItem
              button
              onPress={async () => {
                await fetchCurrentChat(cur.chat.id)
                navigation.navigate('SingleChat')
              }}
            >
              <Text>
                With:{' '}
                {
                  cur.users.find(u => {
                    return u.fullName !== user.fullName
                  }).fullName
                }{' '}
                {'\n'}
                Date: {cur.date.toString()} {'\n'}
                Map Link: {cur.link}
              </Text>

              <Right>
                <Image source={cur.imageRef} />

                {/* <Icon name="arrow-forward" /> */}
              </Right>
            </CardItem>
          </React.Fragment>
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
  })(ActiveMeetingComp)
)
