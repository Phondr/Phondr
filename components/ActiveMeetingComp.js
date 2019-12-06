import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Body, Right, Card, CardItem, Text} from 'native-base'
import {TouchableOpacity, Image} from 'react-native'
import {withNavigation, NavigationEvents} from 'react-navigation'
import {setChat, fetchCurrentChat} from '../redux/currentChat'
import ProgressBar from './ProgressBar'
import {fetchAllMeetings} from '../redux/meetings'
import Spinner from '../components/Spinner'
const ActiveMeetingComp = ({
  user,
  meetings,
  fetchAllMeetings,
  navigation,
  setChat,
  fetchCurrentChat,
  setParent,
  loading
}) => {
  const active = meetings.filter(meeting => meeting.status === 'active')

  
  if (!active.length) {
    return (
      <Card>
        <CardItem header>
          <Text>No Active Meetings</Text>
        </CardItem>
      </Card>
    )
  }
  return (
    <Card>
      <NavigationEvents
        onDidFocus={payload => {
          fetchAllMeetings(user.id)
        }}
      />
      <CardItem header>
        <Text>Active Meetings</Text>
      </CardItem>

      {active.map(cur => {
        console.log('cur imageRef', cur.imageRef)
        return (
          <TouchableOpacity
            onPress={async () => {
              await fetchCurrentChat(cur.chat.id)
              navigation.navigate('SingleChat')
            }}
            key={cur.id}
          >
            <CardItem>
              <Text style={{color: 'green'}}>Name: {cur.name}</Text>
            </CardItem>

            <CardItem cardBody>
              <Image
                source={{uri: cur.imageRef}}
                style={{height: 120, width: null, flex: 1}}
              />
            </CardItem>

            <CardItem>
              <Text note>
                With:{' '}
                {
                  cur.users.find(u => {
                    return u.fullName !== user.fullName
                  }).fullName
                }
                {'\n'}
                Date: {new Date(+cur.date).toString()} {'\n'}
                Map Link: {cur.link}
              </Text>
            </CardItem>
          </TouchableOpacity>
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
