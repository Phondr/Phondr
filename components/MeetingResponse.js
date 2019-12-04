import React from 'react'
import {View, Text} from 'react-native'
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton
} from 'react-native-popup-dialog'
import {connect} from 'react-redux'
import {updateMeeting} from '../redux/currentMeeting'

const MeetingResponse = ({
  reply_to,
  closeFooter,
  updateMeeting,
  meetingId,
  reply
}) => {
  return (
    <View>
      <Dialog
        onDismiss={() => {
          closeFooter()
        }}
        width={0.9}
        visible={reply}
        rounded
        actionsBordered
        dialogTitle={
          <DialogTitle
            title={`Do You want to accept this invitation from ${reply_to}?`}
            style={{
              backgroundColor: '#F7F7F8'
            }}
            hasTitleBar={false}
            align="left"
          />
        }
        footer={
          <DialogFooter>
            <DialogButton
              text="Yes"
              bordered
              onPress={() => {
                updateMeeting(meetingId, 'active')
                closeFooter()
              }}
              key="button-1"
            />
            <DialogButton
              text="No"
              bordered
              onPress={() => {
                updateMeeting(meetingId, 'declined')
                closeFooter()
              }}
              key="button-2"
            />
          </DialogFooter>
        }
      >
        <DialogContent
          style={{
            backgroundColor: '#F7F7F8'
          }}
        >
          <Text>INPUT THE INTRO HERE</Text>
        </DialogContent>
      </Dialog>
    </View>
  )
}

export default connect(null, {updateMeeting})(MeetingResponse)
