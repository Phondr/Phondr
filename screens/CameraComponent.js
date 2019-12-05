import React, {Component} from 'react'
import {Text, View, TouchableOpacity} from 'react-native'
import * as Permissions from 'expo-permissions'
import {Camera} from 'expo-camera'

//https://stackoverflow.com/questions/52707002/how-to-snap-pictures-using-expo-react-native-camera

export class CameraComponent extends Component {
  constructor() {
    super()
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      photo: ''
    }
  }

  async componentDidMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({hasCameraPermission: status === 'granted'})
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync()
      if (photo) {
        this.setState({photo})
      }
    }
  }

  render() {
    const {hasCameraPermission} = this.state
    if (hasCameraPermission === null) {
      return <View />
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else {
      return (
        <View style={{flex: 1}}>
          <Camera
            style={{flex: 1}}
            type={this.state.type}
            ref={ref => {
              this.camera = ref
            }}
          >
            <View
              style={{
                backgroundColor: 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  })
                }}
              >
                <Text style={{fontSize: 18, marginBottom: 10, color: 'white'}}>
                  Flip
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.snap}
              >
                <Text style={{fontSize: 18, marginBottom: 10, color: 'white'}}>
                  Take
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )
    }
  }
}

export default CameraComponent
