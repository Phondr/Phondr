import React, {Component} from 'react'
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  View
} from 'native-base'
import {StyleSheet} from 'react-native'
import MapView, {Marker} from 'react-native-maps'

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
        longitude: 0,
      },
      flag: false
    }
    this.selectLocation = this.selectLocation.bind(this)
    this.dragMarker = this.dragMarker.bind(this)
  }

  selectLocation() {
    navigator.geolocation.getCurrentPosition(position =>
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }
      })
    )
  }
  componentDidMount() {
    this.selectLocation()
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
        >
          <Marker
            coordinate={this.state.marker}
            draggable
            onDragEnd={this.dragMarker}
          />
        </MapView>
        {this.state.flag ? (
          <Button style={{position: 'absolute'}}>
            <Text>CLICK ME</Text>
          </Button>
        ) : null}
      </View>
    )
  }
}
