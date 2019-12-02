import React from 'react'
import {StatusBar, Dimensions} from 'react-native'
import {View, Text, Button, Icon} from 'native-base'
import CustomHeader from '../components/CustomHeader'
import * as Permissions from 'expo-permissions'
import {Audio} from 'expo-av'
import {RNS3} from 'react-native-s3-upload'
import {amazonConfig} from '../secrets'

export default class renderAudio extends React.Component {
  constructor() {
    super()
    this.state = {
      hasAudioPermission: false,
      isPlaying: false
    }
    this.playSound = this.playSound.bind(this)
    this.stopSound = this.stopSound.bind(this)
  }
  async componentDidMount() {
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
    if (audio.status === 'granted') {
      this.setState({hasAudioPermission: true})
    }
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      staysActiveInBackground: false,
      allowsRecordingIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true
    })
  }
  async playSound() {
    if (this.soundObject) {
      await this.soundObject.unloadAsync()
    }
    this.soundObject = new Audio.Sound()
    this.setState({isPlaying: true})
    await this.soundObject.loadAsync({
      uri: `${this.props.message.text}`
    })
    await this.soundObject
      .playAsync()
      .then(async playbackStatus => {
        setTimeout(() => {
          this.soundObject.unloadAsync()
          this.setState({isPlaying: false})
        }, playbackStatus.playableDurationMillis)
      })
      .catch(error => {
        console.log(error)
      })
  }
  stopSound() {
    this.soundObject.unloadAsync()
    this.setState({isPlaying: false})
  }
  render() {
    return (
      <View
        style={{
          // alignSelf: 'center',
          // left: 90,
          position: 'relative',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.5,
          backgroundColor: 'transparent'
        }}
      >
        {this.state.isPlaying === false ? (
          <Icon name="ios-play" onPress={() => this.playSound()} />
        ) : (
          <Icon name="ios-play" style={{color: 'red'}} />
        )}
      </View>
    )
  }
}
