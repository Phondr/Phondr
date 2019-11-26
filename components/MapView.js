import React, {Component} from 'react'
import {View, Picker, Item, Icon, Form, Input, Button, Text} from 'native-base'
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
      placeType: 'restaurant',
      // Search: "",
      Found: [],
      pointer: 0
    }
    this.initialLocation = this.initialLocation.bind(this)
    this.moveTo = this.moveTo.bind(this)
    this.createMarker = this.createMarker.bind(this)
    this.onSelectPlaceType = this.onSelectPlaceType.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.searchNearBy = this.searchNearBy.bind(this)
    this.searchByName = this.searchByName.bind(this)
    this.moveToNextMarker = this.moveToNextMarker.bind(this)
  }

  componentDidMount() {
    this.initialLocation()
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
  moveTo(lat, lng) {
    this.setState({
      region: {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    })
  }
  moveToNextMarker() {
    let nextMarker = 0
    if (this.state.pointer + 1 !== this.state.Found.length)
      nextMarker = this.state.pointer + 1
    this.setState({pointer: nextMarker})
    this.moveTo(
      this.state.Found[this.state.pointer].geometry.location.lat,
      this.state.Found[this.state.pointer].geometry.location.lng
    )
  }
  createMarker(e) {
    console.log(e.nativeEvent.coordinate)
    this.setState({
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
  searchByName(text) {
    // const temp = this.state.Search
    console.log(text)
    let newTemp = text.replace(" ", "20%")
    while(newTemp.includes(" ")){
      newTemp = newTemp.replace(" ","20%")
    }
    const theUrl =
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${newTemp}&inputtype=textquery&fields=geometry,place_id&key=` +
      googlePlaceApiKey
    axios
      .get(theUrl)
      .then(res => {
        this.setState({Found: res.data.candidates})
        console.log(res.data)
      })
      .catch(err => console.log(err))
  }
  onSelectPlaceType(value) {
    this.setState({
      placeType: value
    })
  }
  onSearch(text) {
    this.setState({
      Search: text
    })
    this.searchByName()
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
          // onPress={this.createMarker}
          onPress={this.searchByName}
          provider={PROVIDER_GOOGLE}
        >
          {/* {this.state.nearby.length !== 0
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
            : null} */}
          {this.state.Found.length !== 0
            ? this.state.Found.map(found => (
                <Marker
                  key={found.place_id}
                  coordinate={{
                    latitude: found.geometry.location.lat,
                    longitude: found.geometry.location.lng
                  }}
                />
              ))
            : null}
        </MapView>
        {/* <Item picker>
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
        </Item> */}
        <Item rounded>
          <Input
            placeholder="search by name"
            value={this.state.Search}
            onSubmitEditing={(event)=>this.searchByName(event.nativeEvent.text)}
          />
        </Item>
        {this.state.Found.length > 1 ? (
          <Button onPress={this.moveToNextMarker}>
            <Text>next marker</Text>
          </Button>
        ) : null}
      </View>
    )
  }
}
