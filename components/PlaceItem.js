import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {Container, Content, Card, CardItem} from 'native-base'
import {connect} from 'react-redux'
import {updatePendingDate, updatePendingLocation} from '../redux/invitation'

const PlaceItem = ({
  description,
  fetchDetails,
  place_id,
  updatePendingLocation
}) => {
  const handlePress = async () => {
    const {geometry} = fetchDetails(place_id)
    updatePendingLocation([
      geometry.location.latitude,
      geometry.location.longitude
    ])
  }
  return (
    <React.Fragment>
      <TouchableOpacity onPress={handlePress}>
        <CardItem>
          <Text>{description}</Text>
        </CardItem>
      </TouchableOpacity>
    </React.Fragment>
  )
}

export default connect(({invitation}) => ({invitation}), {
  updatePendingLocation
})(PlaceItem)
