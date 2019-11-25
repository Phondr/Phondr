import React, {Component} from 'react'
import {Button, Text, View, Container, Footer, FooterTab, Title} from 'native-base'
import {StyleSheet} from 'react-native'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import googlePlaceApiKey from '../secrets'
import axios from 'axios'
export default class Mapv extends Component {
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
      nearby: [],
      flag: false
    }
    this.initialLocation = this.initialLocation.bind(this)
    this.dragMarker = this.dragMarker.bind(this)
    this.searchNearBy = this.searchNearBy.bind(this)
    // this.selectMarker = this.selectMarker.bind(this)
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
  async componentDidMount() {
    this.initialLocation()
    // this.searchNearBy()
  }
  dragMarker(e) {
    console.log(e.nativeEvent.coordinate)
    this.setState({
      marker: e.nativeEvent.coordinate,
      flag: true,
      region: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    })
    console.log(this.state.region.latitude, this.state.region.longitude)
    this.searchNearBy()
  }
  searchNearBy() {
    const theUrl =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.state.region.latitude},${this.state.region.longitude}&radius=1500&type=restaurant&key=` +
      googlePlaceApiKey
    axios
      .get(theUrl)
      .then(res => {
        this.setState({nearby: res.data.results})
        console.log(res.data)
        res.data.results.forEach(x => {
          console.log(x.name)
        })
      })
      .catch(err => console.log(err))
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
          {this.state.nearby.length !== 0
            ? this.state.nearby.map(x => (
                <Marker
                  key={x.id}
                  coordinate={{
                    latitude: x.geometry.location.lat,
                    longitude: x.geometry.location.lng
                  }}
                  Title={`${x.name}(${x.rating} rating)`}
                  description={x.vicinity}
                />
              ))
            : null}
          <Marker
            coordinate={this.state.marker}
            draggable
            pinColor={'#000000'}
            onDragEnd={this.dragMarker}
          />
        </MapView>
        {this.state.flag ? (
          <Footer>
            <FooterTab>
              <Button>
                <Text>Send</Text>
              </Button>
            </FooterTab>
          </Footer>
        ) : null}
      </View>
    )
  }
}
