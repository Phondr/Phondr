import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Body, Right, Card, CardItem, Text, View} from 'native-base'
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
    <View>
      <Card>
        <NavigationEvents
          onWillFocus={payload => {
            fetchAllMeetings(user.id)
          }}
        />
        {active.map(cur => {
          return (
            <React.Fragment key={cur.id}>
              <CardItem
                style={{
                  backgroundColor: '#FF0800',
                  borderColor: 'black',
                  borderWidth: 2
                }}
              >
                <Text style={{color: 'white'}}>Name: {cur.name}</Text>
              </CardItem>
              <CardItem
                button
                onPress={async () => {
                  await fetchCurrentChat(cur.chat.id)
                  navigation.navigate('SingleChat')
                }}
                style={{backgroundColor: '#FF91AF'}}
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
                  <Icon name="arrow-forward" />
                </Right>
              </CardItem>
            </React.Fragment>
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
  })(ActiveMeetingComp)
)
