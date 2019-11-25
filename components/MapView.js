import React, {Component} from 'react'
import {Button, Text, View} from 'native-base'
import {StyleSheet} from 'react-native'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import {TextInput} from 'react-native-gesture-handler'

export default class Sendingmeetings extends Component {
  constructor() {
    super()
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      Location: {},
      marker: {
        latitude: 0,
        longitude: 0
      },
      flag: false
    }
    this.initialLocation = this.initialLocation.bind(this)
    this.dragMarker = this.dragMarker.bind(this)
    this.fetchMarkerData = this.fetchMarkerData.bind(this)
  }

  initialLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }
      })
    })
  }
  componentDidMount() {
    this.initialLocation()
  }
  dragMarker(e) {
    this.setState({marker: e.nativeEvent.coordinate, flag: true})
  }
  render() {
    const styles = StyleSheet.create({
      map: {
        ...StyleSheet.absoluteFill
      }
    })
    return (
      <View style={styles.map}>
        <MapView
          style={styles.map}
          region={this.state.region}
          onPress={this.dragMarker}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={this.state.marker}
            draggable
            onDragEnd={this.dragMarker}
          />
        </MapView>
        {this.state.flag ? (
          <Footer>
            <FooterTab>
              <Button style={{position: 'absolute'}}>
                <Text>Send</Text>
              </Button>
            </FooterTab>
          </Footer>
        ) : null}
      </View>
    )
  }
}
