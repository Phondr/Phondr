import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Body, Right, Card, CardItem, Text, View} from 'native-base'
import {withNavigation, NavigationEvents} from 'react-navigation'
import {setChat, fetchCurrentChat} from '../redux/currentChat'
import ProgressBar from './ProgressBar'
import {fetchAllMeetings} from '../redux/meetings'
import CustomHeader from './CustomHeader'

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
    <View >
      <CustomHeader title='pendingMeeting' />
      <Card>
        <NavigationEvents
          onWillFocus={payload => {
            fetchAllMeetings(user.id)
          }}
        />
        <CardItem header style={{backgroundColor:'#E0115F'}}>
          <Text style={{color: 'white'}}>Pending Meetings</Text>
        </CardItem>

        {pending.map(cur => {
          return (
            <CardItem
              button
              onPress={async () => {
                await fetchCurrentChat(cur.chat.id)
                navigation.navigate('SingleChat')
              }}
              style={{backgroundColor:'#FF91AF'}}
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
    </View>
  )
}

export default withNavigation(
  connect(({meetings, user}) => ({meetings, user}), {
    fetchAllMeetings,
    setChat,
    fetchCurrentChat
  })(PendingMeetingComp)
)
