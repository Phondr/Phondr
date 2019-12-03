import React from 'react'
import {View, Text} from 'react-native'
import RNUrlPreview from 'react-native-url-preview'
const PreviewLink = ({currentMeeting}) => {
  return (
    <View>
      <Text>New Meeting Invitation!</Text>

      <Text>Address: {currentMeeting.address}</Text>

      <Text>Date: {`${new Date(+currentMeeting.date)}`}</Text>

      <RNUrlPreview text={`${currentMeeting.link}`} />
    </View>
  )
}

export default PreviewLink
