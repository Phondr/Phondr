import React, {Component} from 'react'
import {View, Picker, Item, Icon, Form} from 'native-base'
import {StyleSheet} from 'react-native'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import googlePlaceApiKey from '../secrets'
import axios from 'axios'
import {colors, PlaceTypes} from './ulti'

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
      nearby: [],
      placeType: 'restaurant'
    }
    this.initialLocation = this.initialLocation.bind(this)
    this.createMarker = this.createMarker.bind(this)
    this.searchNearBy = this.searchNearBy.bind(this)
    this.onSelectPlaceType = this.onSelectPlaceType.bind(this)
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
  createMarker(e) {
    console.log(e.nativeEvent.coordinate)
    this.setState({
      flag: true,
      region: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    })
    this.searchNearBy(
      e.nativeEvent.coordinate.latitude,
      e.nativeEvent.coordinate.longitude
    )
  }
  searchNearBy(lat, long) {
    const theUrl =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=1500&type=${this.state.placeType}&key=` +
      googlePlaceApiKey
    axios
      .get(theUrl)
      .then(res => {
        this.setState({nearby: res.data.results})
        res.data.results.forEach(x => {
          console.log(x.name)
        })
      })
      .catch(err => console.log(err))
  }
  onSelectPlaceType(value) {
    console.log(this.state.placeType)
    this.setState({
      placeType: value
    })
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
          onPress={this.createMarker}
          provider={PROVIDER_GOOGLE}
        >
          {this.state.nearby.length !== 0
            ? this.state.nearby.map((x, i) => (
                <Marker
                  key={x.id}
                  coordinate={{
                    latitude: x.geometry.location.lat,
                    longitude: x.geometry.location.lng
                  }}
                  title={`${x.name}(${x.rating} rating)`}
                  description={`In the vicinity of : ${x.vicinity} `}
                  pinColor={colors[i]}
                />
              ))
            : null}
        </MapView>
        <Form>
          <Item picker>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Select your place type"
              placeholderStyle={{color: '#bfc6ea'}}
              placeholderIconColor="#007aff"
              selectedValue={this.state.placeType}
              onValueChange={this.onSelectPlaceType}
            >
              {PlaceTypes.map(x => (
                <Picker.Item key={x} label={x} value={x} />
              ))}
            </Picker>
          </Item>
        </Form>
      </View>
    )
  }
}
