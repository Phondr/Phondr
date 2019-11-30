import React, {Component} from 'react'
import {
  View,
  Picker,
  Item,
  Icon,
  Input,
  Button,
  Text,
  Container,
  Content
} from 'native-base'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import {googlePlaceApiKey} from '../secrets'
import axios from 'axios'
import {colors, PlaceTypes} from './ulti'
import CustomHeader from './CustomHeader'
import {connect} from 'react-redux'

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
      currentCoord: {
        latitude: 0,
        longitude: 0
      },
      Location: {},
      nearby: [],
      placeType: 'restaurant',
      Found: [],
      pointer: 0,
      flag: true,
      show: true
    }
    this.initialLocation = this.initialLocation.bind(this)
    this.moveTo = this.moveTo.bind(this)
    this.createMarker = this.createMarker.bind(this)
    this.onSelectPlaceType = this.onSelectPlaceType.bind(this)
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
        },
        currentCoord: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
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
      flag: false,
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
        console.log(res.data)
        res.data.results.forEach(x => {
          console.log(x.name)
        })
      })
      .catch(err => console.log(err))
  }
  searchByName(text) {
    this.setState({flag: true})
    let newTemp = text
    while (newTemp.includes(' ')) {
      newTemp = newTemp.replace(' ', '20%')
    }
    const theUrl =
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${newTemp}&inputtype=textquery&fields=geometry,place_id,name,rating,formatted_address&key=` +
      googlePlaceApiKey
    axios
      .get(theUrl)
      .then(res => {
        console.log(res.data)
        this.setState({Found: res.data.candidates})
      })
      .catch(err => console.log(err))
  }
  onSelectPlaceType(value) {
    this.setState({
      placeType: value
    })
  }
  render() {
    return (
      <View>
        <CustomHeader title="Map" />
        {this.state.show ? (
          <Item regular>
            <Input
              placeholder="search by name"
              value={this.state.Search}
              onSubmitEditing={event =>
                this.searchByName(event.nativeEvent.text)
              }
            />
          </Item>
        ) : null}
        {this.state.show ? (
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
        ) : null}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <View>
            <Button
              block
              style={{width: 100}}
              onPress={() => this.setState({show: !this.state.show})}
            >
              <Text style={{color: 'red'}}>SHOW/HIDE</Text>
            </Button>
          </View>
          <View>
            {this.state.Found.length > 0 ? (
              <Button onPress={this.moveToNextMarker}>
                <Text>next marker</Text>
              </Button>
            ) : null}
          </View>
          <View>
            <Button
              block
              style={{width: 100}}
              onPress={() => {
                this.moveTo(
                  this.state.currentCoord.latitude,
                  this.state.currentCoord.longitude
                )
              }}
            >
              <Text>Move to Your location</Text>
            </Button>
          </View>
        </View>

        <MapView
          style={{width: '100%', height: '80%'}}
          region={this.state.region}
          onPress={this.createMarker}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={{
              latitude: this.state.currentCoord.latitude,
              longitude: this.state.currentCoord.longitude
            }}
            title="YOU"
            pinColor="#15F4EE"
          />
          {this.state.nearby.length !== 0 && this.state.flag === false
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
                  style={{position: 'absolute'}}
                />
              ))
            : null}
          {this.state.Found.length !== 0 && this.state.flag === true
            ? this.state.Found.map(found => (
                <Marker
                  key={found.place_id}
                  coordinate={{
                    latitude: found.geometry.location.lat,
                    longitude: found.geometry.location.lng
                  }}
                  title={`${found.name}(${found.rating} rating)`}
                  description={`${found.formatted_address}`}
                />
              ))
            : null}
        </MapView>
      </View>
    )
  }
}
