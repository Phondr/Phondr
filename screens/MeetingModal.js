import React, {Component, useState, useEffect} from 'react'
import {Text, StyleSheet, View, ScrollView} from 'react-native'
import {
  Container,
  Content,
  Button,
  Icon,
  Card,
  CardItem,
  Body,
  Form
} from 'native-base'
import PlaceSearch from '../components/PlaceSearch'
import Modal from 'react-native-modal'
import MapView, {Marker, Callout, PROVIDER_GOOGLE} from 'react-native-maps'
import {connect} from 'react-redux'
import CustomDatePicker from '../components/CustomDatePicker'
import {colors} from '../placesData'
import {placesAPI} from '../secrets'
import {updatePendingLocation} from '../redux/invitation'
import axios from 'axios'
import Spinner from '../components/Spinner'
const MeetingModal = ({invitation, updatePendingLocation}) => {
  const [region, setRegion] = useState({})
  const [currentCoord, setCurrentCoord] = useState({})
  const [nearby, setNearby] = useState([])
  const [loading, setLoading] = useState(true)

  const updateInvitation = data => {
    const coords = [data.geometry.location.lat, data.geometry.location.lng]
    console.log('updateInv', data)
    updatePendingLocation(
      coords,
      data.name,
      `${data.name}, ${data.vicinity}`,
      data.rating
    )
  }

  const setLocation = inv => {
    if (!inv) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log('navigator geolo', position.coords)
        setRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        })
        setCurrentCoord({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      })
    } else {
      setRegion({
        latitude: inv.coords[0],
        longitude: inv.coords[1],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      })
      setCurrentCoord({
        latitude: inv.coords[0],
        longitude: inv.coords[1]
      })
    }
  }

  const createMarker = e => {
    console.log('e native', e.nativeEvent.coordinate)
    setRegion({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    })
    searchNearby(
      e.nativeEvent.coordinate.latitude,
      e.nativeEvent.coordinate.longitude
    )
  }

  const searchNearby = async (lat, long) => {
    const theUrl =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=1500&type=cafe&key=` +
      placesAPI
    const {data} = await axios.get(theUrl)
    console.log('data from searchnearby', data)
    setNearby(data.results)
  }

  useEffect(() => {
    setLocation()
    setLoading(false)
  }, [])

  useEffect(() => {
    console.log('invitation', invitation)
    if (invitation.name) {
      setLocation(invitation)
    }
  }, [invitation])

  const formatRegion = inv => {
    return {
      latitude: inv.coords[0],
      longitude: inv.coords[1],
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
  }
  if (invitation.name) {
    console.log('TCL: invitation', invitation)
    //console.log('formated invitation', formatRegion(invitation))
  }
  console.log('nearby', nearby)
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Spinner />
      </View>
    )
  }
  return (
    // <Modal
    //   coverScreen={false}
    //   isVisible={true} // this will be tied to state from parent
    //   onBackdropPress={() => {}}
    // >
    <Container>
      <Content contentContainerStyle={{marginTop: 20}}>
        <PlaceSearch />

        <View>
          {invitation.name && (
            <Card>
              <CardItem>
                <Text>Selected: {invitation.address}</Text>
              </CardItem>
            </Card>
          )}

          {region.latitude && currentCoord.latitude && (
            <MapView
              style={{
                height: 150,
                margin: 10,
                borderWidth: 1,
                borderColor: '#000000'
              }}
              region={region}
              onPress={createMarker}
              provider={PROVIDER_GOOGLE}
            >
              <Marker
                coordinate={currentCoord}
                title={
                  `${invitation.name}(${invitation.rating} rating)` ||
                  'Your Location'
                }
                description={invitation.address || ''}
              />
              {nearby.length > 0 &&
                nearby.map((x, i) => {
                  console.log('mapping')
                  return (
                    <Marker
                      key={x.id}
                      coordinate={{
                        latitude: x.geometry.location.lat,
                        longitude: x.geometry.location.lng
                      }}
                      title={`${x.name}(${x.rating} rating)`}
                      description={`In the vicinity of : ${x.vicinity} `}
                      //pinColor={colors[i]}
                      //style={{position: 'absolute'}}
                      onPress={() => updateInvitation(x)}
                      onCalloutPress={() => updateInvitation(x)}
                    >
                      {/* <Callout tooltip>
                        <View>
                          <Text>
                            {`${x.name}(${x.rating} rating)`}
                            {'\n'}
                            {`In the vicinity of : ${x.vicinity} `}
                          </Text>
                        </View>
                      </Callout> */}
                    </Marker>
                  )
                })}
            </MapView>
          )}
        </View>

        <CustomDatePicker />

        {!!invitation.date && (
          <Card>
            <CardItem>
              <Text>
                Chosen Date: {invitation.date.toString().substr(4, 12)}
              </Text>
            </CardItem>
          </Card>
        )}
      </Content>
    </Container>
    // </Modal>
  )
}

const styles = StyleSheet.create({})

export default connect(({invitation}) => ({invitation}), {
  updatePendingLocation
})(MeetingModal)
