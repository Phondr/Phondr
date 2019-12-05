import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {TouchableOpacity, Image} from 'react-native'
import {Icon, Left, Body, Right, Card, CardItem, Text} from 'native-base'
import {withNavigation, NavigationEvents} from 'react-navigation'
import {setChat, fetchCurrentChat} from '../redux/currentChat'
import ProgressBar from './ProgressBar'
import {fetchAllMeetings} from '../redux/meetings'
import Spinner from '../components/Spinner'
import CustomHeader from './CustomHeader'

const PendingMeetingComp = ({
  user,
  meetings,
  fetchAllMeetings,
  navigation,
  setChat,
  fetchCurrentChat,
  setParent,
  loading
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

  // if (loading) {
  //   return <Spinner />
  // }
  if (!pending.length) {
    return (
      <Card>
        <CardItem header>
          <Text>No Pending Meetings</Text>
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
        <Text>Pending Meetings</Text>
      </CardItem>

      {pending.map(cur => {
        console.log('cur imageRef', cur.imageRef)
        return (
          <TouchableOpacity
            onPress={async () => {
              await fetchCurrentChat(cur.chat.id)
              navigation.navigate('SingleChat')
            }}
            key={cur.id}
          >
            <CardItem  style={{
                  backgroundColor: '#FF0800',
                  borderColor: 'black',
                  borderWidth: 2
                }}>
              <Text style={{color: 'white'}}>Name: {cur.name}</Text>
            </CardItem>

            <CardItem cardBody>
              <Image
                source={{uri: cur.imageRef}}
                style={{height: 120, width: null, flex: 1}}
              />
            </CardItem>

            <CardItem style={{backgroundColor: '#FF91AF'}}>
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
  })(PendingMeetingComp)
)
