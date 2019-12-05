import React from 'react'
import {View, Text} from 'react-native'
import {withNavigation, NavigationEvents} from 'react-navigation'
import {connect} from 'react-redux'

const ChatEvent = ({currentMeeting, user, currentChat, onSend, navigation}) => {
  const sendMeeting = () => {
    console.log(
      'props.navigation inside chatevent',
      navigation.getParam('created', 'not-created')
    )

    const {name, address, link, location, date, imageRef, id} = currentMeeting
    const formattedMessage = {
      content: `${link}++New Invitation To Meet!++Address: ${address}++Date: ${new Date(
        +date
      ).toString()}++++Long press this message to respond.`,
      imageRef: imageRef,
      meetingId: id,
      userId: user.id,
      length: 10,
      chatId: currentChat.id
    }
    navigation.setParams({created: false})
    onSend(formattedMessage, true)
  }

  return (
    <React.Fragment>
      <NavigationEvents onWillFocus={sendMeeting} />
    </React.Fragment>
  )
}

export default withNavigation(
  connect(({currentMeeting, user, currentChat}) => ({
    currentMeeting,
    user,
    currentChat
  }))(ChatEvent)
)
