import React from 'react'
import {View, Text, TouchableOpacity, Alert} from 'react-native'
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
    const location = [geometry.location.latitude, geometry.location.longitude]
    Alert.alert(location)
    updatePendingLocation(location)
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
