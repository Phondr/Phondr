import React from 'react'
import {View, Text, TouchableOpacity, Alert} from 'react-native'
import {Container, Content, Card, CardItem} from 'native-base'
import {connect} from 'react-redux'
import {updatePendingDate, updatePendingLocation} from '../redux/invitation'

const PlaceItem = ({
  place_id,
  description,
  updatePendingLocation,
  fetchDetails,
  term,
  setTerm
}) => {
  const handlePress = async () => {
    const res = await fetchDetails(place_id)
    //console.log('res in placeitem', res)
    const {geometry, name, rating, url, photos} = res

    console.log('TCL: link', url)
    const coords = [geometry.location.lat, geometry.location.lng]
    const imageRef = photos[0].photo_reference
    updatePendingLocation(coords, name, description, rating, url, imageRef)
    setTerm({term: ''})
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
