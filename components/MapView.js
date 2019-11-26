import React, {Component} from 'react'
import {
  View,
  Picker,
  Item,
  Icon,
} from 'native-base'
import {StyleSheet} from 'react-native'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import googlePlaceApiKey from '../secrets'
import axios from 'axios'
import {colors, type} from './ulti'

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
      selected2: undefined
    }
    this.initialLocation = this.initialLocation.bind(this)
    this.createMarker = this.createMarker.bind(this)
    this.searchNearBy = this.searchNearBy.bind(this)
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
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=1500&type=restaurant&key=` +
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
  onValueChange2(value) {
    this.setState({
      selected2: value
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
        <Item picker>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            placeholder="Select your SIM"
            placeholderStyle={{color: '#bfc6ea'}}
            placeholderIconColor="#007aff"
            selectedValue={this.state.selected2}
            onValueChange={this.onValueChange2.bind(this)}
          >
            <Picker.Item label="Wallet" value="key0" />
            <Picker.Item label="ATM Card" value="key1" />
            <Picker.Item label="Debit Card" value="key2" />
            <Picker.Item label="Credit Card" value="key3" />
            <Picker.Item label="Net Banking" value="key4" />
          </Picker>
        </Item>
      </View>
    )
  }
}
