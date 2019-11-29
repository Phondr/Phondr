import React, {Component} from 'react'
import {Text, StyleSheet, View, ScrollView} from 'react-native'
import {
  Container,
  Content,
  Button,
  Icon,
  Card,
  CardItem,
  Body
} from 'native-base'
import PlaceSearch from '../components/PlaceSearch'
import Modal from 'react-native-modal'
import MapView, {Marker} from 'react-native-maps'
import {connect} from 'react-redux'

const MeetingModal = ({invitation}) => {
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
    console.log('formated invitation', formatRegion(invitation))
  }
  return (
    // <Modal
    //   coverScreen={false}
    //   isVisible={true} // this will be tied to state from parent
    //   onBackdropPress={() => {}}
    // >
    <Container>
      <Content>
        <PlaceSearch />

        {invitation.name && (
          <View>
            <MapView
              style={{
                height: 150,
                margin: 10,
                borderWidth: 1,
                borderColor: '#000000'
              }}
              region={formatRegion(invitation)}
            >
              <Marker
                coordinate={{
                  latitude: formatRegion(invitation).latitude,
                  longitude: formatRegion(invitation).longitude
                }}
                title={invitation.name}
              />
            </MapView>
          </View>
        )}
      </Content>
    </Container>
    // </Modal>
  )
}

const styles = StyleSheet.create({})

export default connect(({invitation}) => ({invitation}))(MeetingModal)
