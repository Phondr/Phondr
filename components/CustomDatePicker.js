import React, {useState} from 'react'
import {View, Text} from 'react-native'
import {DatePicker, Button, Form, Item, Icon} from 'native-base'
import {connect} from 'react-redux'
import {updatePendingDate} from '../redux/invitation'
const CustomDatePicker = ({invitation, updatePendingDate}) => {
  //const [date,setDate]=useState(null)
  if (invitation.date) {
    console.log('inv date', invitation.date)
  }
  return (
    <Item last>
      <Icon name="date-range" style={{color:'red'}} type={'MaterialIcons'} />
      <DatePicker
        //defaultDate={new Date(2018, 4, 4)}
        minimumDate={new Date(2018, 1, 1)}
        maximumDate={new Date(2018, 12, 31)}
        locale={'en'}
        timeZoneOffsetInMinutes={undefined}
        modalTransparent={false}
        animationType={'fade'}
        androidMode={'default'}
        placeHolderText="Select date"
        placeHolderTextStyle={{color: '#d3d3d3'}}
        onDateChange={date => {
          console.log('date', date)
          updatePendingDate(date)
        }}
        disabled={false}
      />
    </Item>
  )
}

export default connect(({invitation}) => ({invitation}), {updatePendingDate})(
  CustomDatePicker
)
