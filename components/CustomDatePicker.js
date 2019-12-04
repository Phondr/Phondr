import React, {useState} from 'react'
import {View, Text, Dimensions} from 'react-native'
import {Button, Form, Item, Icon} from 'native-base'
import {connect} from 'react-redux'
import {updatePendingDate} from '../redux/invitation'
import DateTimePicker from 'react-native-modal-datetime-picker'

const CustomDatePicker = ({invitation, updatePendingDate}) => {
  //const [date,setDate]=useState(null)
  if (invitation.date) {
    console.log('inv date', invitation.date)
  }
  const [isDateTimePickerVisible, setisDateTimePickerVisible] = useState(false)
  const [date, setDate] = useState(null)
  showDateTimePicker = () => {
    setisDateTimePickerVisible(true)
  }

  hideDateTimePicker = () => {
    setisDateTimePickerVisible(false)
  }

  handleDatePicked = date => {
    setDate(date)
    updatePendingDate(date)
    hideDateTimePicker()
  }
  return (
    <Item last>
      <Icon
        name="date-range"
        type={'MaterialIcons'}
        onPress={() => showDateTimePicker()}
      />
      {date === null ? (
        <Text
          style={{width: Dimensions.get('window').width}}
          onPress={() => showDateTimePicker()}
        >
          Select a date
        </Text>
      ) : (
        <Text
          style={{width: Dimensions.get('window').width}}
          onPress={() => showDateTimePicker()}
        >
          Select new date
        </Text>
      )}
      <DateTimePicker
        isVisible={isDateTimePickerVisible}
        onConfirm={date => handleDatePicked(date)}
        onCancel={() => hideDateTimePicker()}
      />
    </Item>
  )
}

export default connect(({invitation}) => ({invitation}), {updatePendingDate})(
  CustomDatePicker
)
