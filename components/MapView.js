import React, {Component} from 'react'
import {
  Button,
  Text,
  View
} from 'native-base'
import {StyleSheet} from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import axios from 'axios'

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
      POImarker:{},
      flag: false
    }
        // config = {
    //   headers: {
    //     Authorization: 'Bearer <"YOUR YELP API KEY">'
    //   },
    //   params: {
    //     term: 'Tourists Must See List',
    //     raduis: 0.5,
    //     latitude: this.state.region.latitude,
    //     longitude: this.state.region.longitude,
    //     sort_by: 'distance'
    //   }
    // }
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
      // config.params.latitude = position.coords.latitude
      // config.params.longitude = position.coords.longitude
    })
  }
  componentDidMount() {
    this.initialLocation()
    // await this.fetchMarkerData()
  }
  dragMarker(e) {
    this.setState({marker: e.nativeEvent.coordinate, flag: true})
  }
  // fetchMarkerData() {
  //   return axios
  //     .get('https://api.yelp.com/v3/businesses/search', config)
  //     .then(responseJson => {
  //       this.setState({
  //         POImarkers: responseJson.data.businesses.map(x => x),
  //       });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }
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
          {/* {this.state.POImarker.map(POI=> <Marker key={POI.id}
           title={`${marker.name}(${marker.rating} rating)`}
           coordinate={{latitude: marker.coordinates.latitude,
                        longitude: marker.coordinates.longitude}}
            description={`${marker.location.address1}, ${marker.location.city}`} />
          )} */}

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
