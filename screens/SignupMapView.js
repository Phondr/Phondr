import React, { Component } from "react";
import MapView from "react-native-maps";
import { Text, View, StyleSheet, Button } from "react-native";
import { navigation } from "react-navigation";

export class SignupMapView extends Component {
  render() {
    console.log("in map view");
    return (
      <View style={styles.container}>
        <MapView style={styles.map} />
      </View>
    );
  }
}

export default SignupMapView;

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
