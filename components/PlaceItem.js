import React from 'react'
import {View, Text, TouchableOpacity, Alert} from 'react-native'
import {Container, Content, Card, CardItem} from 'native-base'
import {connect} from 'react-redux'
import {updatePendingDate, updatePendingLocation} from '../redux/invitation'

const PlaceItem = ({
  place_id,
  description,
  updatePendingLocation,
  fetchDetails
}) => {
  const handlePress = async () => {
    const res = await fetchDetails(place_id)
    const {geometry, name} = res

    const coords = [geometry.location.lat, geometry.location.lng]
    updatePendingLocation(coords, name)
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

export default connect(null, {
  updatePendingLocation
})(PlaceItem)
