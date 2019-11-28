import React from 'react'
import {placesAPI} from '../secrets'
import {View, Text, TextInput, ScrollView} from 'react-native'
import {Feather} from '@expo/vector-icons'
import SearchBar from '../components/SearchBar'
import {GoogleAutoComplete} from 'react-native-google-autocomplete'

import PlaceItem from './PlaceItem'
class PlaceSearch extends React.Component {
  constructor() {
    super()

    this.setState = this.setState.bind(this)
  }
  render() {
    return (
      <View style={styles.backgroundStyle}>
        <GoogleAutoComplete apiKey={placesAPI} debounce={500}>
          {({handleTextChange, locationResults, fetchDetails}) => (
            <View>
              {console.log('location results', locationResults)}
              <Feather style={styles.iconStyle} name="search" />
              <TextInput
                style={styles.inputStyle}
                placeholder="Search"
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.term}
                onChangeText={val => handleTextChange}
              />
              <ScrollView>
                {locationResults.map(cur => {
                  return (
                    <PlaceItem
                      key={cur.id}
                      fetchDetails={fetchDetails}
                      {...cur}
                    />
                  )
                })}
              </ScrollView>
            </View>
          )}
        </GoogleAutoComplete>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  backgroundStyle: {
    marginTop: 10,
    marginBottom: 1,
    backgroundColor: '#F0EEEE',
    height: 50,
    borderRadius: 5,
    marginHorizontal: 15,
    flexDirection: 'row',
    // alignItems: 'center',//this would shrink the search bar and override flex property
    justifyContent: 'space-between'
  },
  inputStyle: {
    flex: 1,
    fontSize: 18
  },
  iconStyle: {
    fontSize: 35,
    alignSelf: 'center',
    marginHorizontal: 15
  }
})
