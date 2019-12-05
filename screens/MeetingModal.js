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
import {createMeeting} from '../redux/currentMeeting'
import axios from 'axios'
import Spinner from '../components/Spinner'

const MeetingModal = ({
  invitation,
  updatePendingLocation,
  createMeeting,
  currentChat,
  user,
  navigation
}) => {
  const [region, setRegion] = useState({})
  const [currentCoord, setCurrentCoord] = useState({})
  const [nearby, setNearby] = useState([])
  const [loading, setLoading] = useState(true)

  const getDetails = async id => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${placesAPI}`
    const {data} = await axios.post(url)

    return data.result
  }

  const updateInvitation = async ({place_id}) => {
    console.log('placeid', place_id)
    const res = await getDetails(place_id.toString())

    const {geometry, name, rating, url, photos, formatted_address} = res
    const coords = [geometry.location.lat, geometry.location.lng]
    const imageRef = photos[0].photo_reference
    updatePendingLocation(
      coords,
      name,
      formatted_address,
      rating,
      url,
      imageRef
    )
    // const coords = [data.geometry.location.lat, data.geometry.location.lng]
    // const link =
    //   data.photos[0].html_attributions[0].split('"')[1] || 'no photos'
    // const imageRef = data.photos[0].photo_reference

    //console.log('updateInv', data)
    // updatePendingLocation(
    //   coords,
    //   data.name,
    //   `${data.name}, ${data.vicinity}`,
    //   data.rating,
    //   link,
    //   imageRef
    // )
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
    //console.log('TCL: nearby data results', data.results)

    setNearby(data.results)
  }

  const submitMeeting = async (chatId, userId, inv) => {
    if (invitation.date && invitation.name)
      await createMeeting(chatId, userId, inv)
    navigation.navigate('SingleChat', {created: true})
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
    //console.log('TCL: invitation', invitation)
    //console.log('formated invitation', formatRegion(invitation))
  }

  if (loading || !currentCoord.latitude || !region.latitude) {
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
      <Content contentContainerStyle={{marginTop: 30}}>
        <Card>
          <CardItem header>
            <Text>Search a place or click on the map for recommendations</Text>
          </CardItem>
        </Card>

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
                  //console.log('mapping')
                  return (
                    <Marker
                      key={x.id}
                      coordinate={{
                        latitude: x.geometry.location.lat,
                        longitude: x.geometry.location.lng
                      }}
                      title={`${x.name}(${x.rating} rating)`}
                      description={`${x.name}, ${x.vicinity} `}
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
        {!!invitation.date && !!invitation.name ? (
          <Button
            onPress={() => submitMeeting(currentChat.id, user.id, invitation)}
          >
            <Text>Send</Text>
          </Button>
        ) : (
          <Button disabled bordered>
            <Text>Send</Text>
          </Button>
        )}
      </Content>
    </Container>
    // </Modal>
  )
}

const styles = StyleSheet.create({})

export default connect(
  ({invitation, user, currentChat}) => ({invitation, user, currentChat}),
  {
    updatePendingLocation,
    createMeeting
  }
)(MeetingModal)
