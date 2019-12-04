import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import {Icon, Button} from 'native-base'
import {updateMeeting} from '../redux/currentMeeting'

const ReplyToFooter = ({reply_to, closeFooter, updateMeeting, meetingId}) => {
  console.log('meeting id', meetingId)
  return (
    <View style={styles.reply_to_footer}>
      <View style={styles.reply_to_border}></View>
      <View style={styles.reply_to_container}>
        <Text style={styles.reply_to_text}>Reply to {reply_to}:</Text>
        <Text style={styles.reply_to_msg_text}>
          Do you want to accept this invitation?
        </Text>
      </View>
      <View style={styles.close_button_container}>
        <TouchableOpacity
          onPress={() => {
            closeFooter()
            updateMeeting(meetingId, 'declined')
          }}
        >
          <Icon style={{color: 'red'}} name="close" type={'FontAwesome'} />
          <Text>No</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            closeFooter()
            updateMeeting(meetingId, 'active')
          }}
        >
          <Icon
            style={{color: 'green'}}
            name="checkcircleo"
            type={'AntDesign'}
          />
          <Text>Yes</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  reply_to_footer: {
    height: 50,
    flexDirection: 'row',
    marginBottom: 10
  },
  reply_to_border: {
    height: 50,
    width: 5,
    backgroundColor: '#0078ff'
  },
  reply_to_container: {
    flexDirection: 'column'
  },
  reply_to_text: {
    color: '#0078ff',
    paddingLeft: 10,
    paddingTop: 5
  },
  reply_to_msg_text: {
    color: 'gray',
    paddingLeft: 10,
    paddingTop: 5
  },
  close_button_container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10
  }
})

export default connect(null, {updateMeeting})(ReplyToFooter)
