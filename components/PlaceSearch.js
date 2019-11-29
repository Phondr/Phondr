import React from 'react'
import {placesAPI} from '../secrets'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet
} from 'react-native'
import {Feather} from '@expo/vector-icons'
import {GoogleAutoComplete} from 'react-native-google-autocomplete'

import PlaceItem from './PlaceItem'
class PlaceSearch extends React.Component {
  constructor() {
    super()
  }
  render() {
    return (
      <View>
        <GoogleAutoComplete
          apiKey={placesAPI}
          debounce={200}
          queryTypes={'establishment'}
        >
          {({handleTextChange, locationResults, fetchDetails}) => (
            <React.Fragment>
              <View style={styles.backgroundStyle}>
                <Feather style={styles.iconStyle} name="search" />
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Search Place"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={handleTextChange}
                />
              </View>
              <ScrollView>
                {locationResults.map(cur => {
                  console.log('TCL: cur ', cur)
                  return (
                    <PlaceItem
                      key={cur.id}
                      fetchDetails={fetchDetails}
                      {...cur}
                    />
                  )
                })}
              </ScrollView>
            </React.Fragment>
          )}
        </GoogleAutoComplete>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  backgroundStyle: {
    marginTop: 50,
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

export default PlaceSearch
