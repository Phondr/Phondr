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
  closeDialog,
  updateMeeting,
  meetingId,
  reply
}) => {
  console.log('props in meetingresponse', reply_to, meetingId, reply)
  return (
    <View>
      <Dialog
        onDismiss={() => {
          closeDialog()
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
              textStyle={{color: 'green'}}
              bordered
              onPress={() => {
                updateMeeting(meetingId, 'active')
                closeDialog()
              }}
              key="button-1"
            />
            <DialogButton
              text="No"
              textStyle={{color: 'red'}}
              bordered
              onPress={() => {
                updateMeeting(meetingId, 'declined')
                closeDialog()
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
          {<View></View>}
        </DialogContent>
      </Dialog>
    </View>
  )
}

export default connect(null, {updateMeeting})(MeetingResponse)
