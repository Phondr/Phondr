import React from 'react'
import {Camera} from 'expo-camera'
import {Ionicons} from '@expo/vector-icons'
import {Col, Row, Grid} from 'react-native-easy-grid'
import {View, TouchableWithoutFeedback, TouchableOpacity} from 'react-native'

import styles from './styles'

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      capturing: false,
      cameraType: Camera.Constants.Type.back,
      flashMode: Camera.Constants.FlashMode.off
    }
  }
  render() {
    return (
      <Grid style={styles.bottomToolbar}>
        <Row>
          <Col style={styles.alignCenter}>
            <TouchableOpacity
              onPress={() =>
                this.props.setFlashMode(
                  this.props.flashMode === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off
                )
              }
            >
              <Ionicons
                name={
                  this.props.flashMode === Camera.Constants.FlashMode.on
                    ? 'md-flash'
                    : 'md-flash-off'
                }
                color="white"
                size={30}
              />
            </TouchableOpacity>
          </Col>
          <Col size={2} style={styles.alignCenter}>
            <TouchableWithoutFeedback
              onPressIn={this.state.onCaptureIn}
              onPressOut={this.state.onCaptureOut}
              onLongPress={this.state.onLongCapture}
              onPress={this.state.onShortCapture}
              onPress={this.props.handleShortCapture}
              disabled={this.props.loading}
            >
              <View
                style={[
                  styles.captureBtn,
                  this.props.capturing && styles.captureBtnActive
                ]}
              >
                {this.props.capturing && (
                  <View style={styles.captureBtnInternal} />
                )}
              </View>
            </TouchableWithoutFeedback>
          </Col>
          <Col style={styles.alignCenter}>
            <TouchableOpacity
              onPress={() => {
                this.props.setCameraType(
                  this.props.cameraType === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                )
              }}
            >
              <Ionicons name="md-reverse-camera" color="white" size={30} />
            </TouchableOpacity>
          </Col>
        </Row>
      </Grid>
    )
  }
}
