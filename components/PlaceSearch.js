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
import {Item, Icon, Input} from 'native-base'
import {Feather} from '@expo/vector-icons'
import {GoogleAutoComplete} from 'react-native-google-autocomplete'
import {connect} from 'react-redux'

import PlaceItem from './PlaceItem'
class PlaceSearch extends React.Component {
  constructor() {
    super()
    this.state = {term: ''}
  }
  render() {
    return (
      <React.Fragment >
        <GoogleAutoComplete
          apiKey={placesAPI}
          debounce={200}
          queryTypes={'establishment'}
        >
          {({handleTextChange, locationResults, fetchDetails}) => (
            <React.Fragment>
              <Item>
                <Icon style={{color:'red'}} name="search" />
                <Input
                  //style={styles.inputStyle}
                  placeholder="Search Place"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={val => {
                    this.setState({term: val})
                    handleTextChange(val)
                  }}
                  value={this.state.term}
                  placeholderTextColor={'#d3d3d3'}
                  // onEndEditing={handleTextChange}
                />
              </Item>
              {!!this.state.term.length && (
                <ScrollView>
                  {locationResults.map(cur => {
                    return (
                      <PlaceItem
                        key={cur.id}
                        fetchDetails={fetchDetails}
                        {...cur}
                        term={this.state.term}
                        setTerm={this.setState.bind(this)}
                      />
                    )
                  })}
                </ScrollView>
              )}
            </React.Fragment>
          )}
        </GoogleAutoComplete>
      </React.Fragment>
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
