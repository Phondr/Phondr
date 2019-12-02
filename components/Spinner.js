import React from 'react'

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator
} from 'react-native'

const Spinner = ({size}) => {
  return (
    <View style={styles.spinnerStyle}>
      <ActivityIndicator size={size || 'large'} />
    </View>
  )
}

const styles = StyleSheet.create({
  spinnerStyle: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Spinner
