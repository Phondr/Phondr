import React from 'react'
import {StatusBar, Dimensions, StyleSheet} from 'react-native'
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
      uri: `${this.props.message.audio}`
    })
    await this.soundObject
      .playAsync()
      .then(async playbackStatus => {
        console.log('timer', await playbackStatus)
        setTimeout(() => {
          this.soundObject.unloadAsync()
          this.setState({isPlaying: false})
        }, playbackStatus.durationMillis)
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
      <View>
        {this.state.isPlaying === false ? (
          <Icon
            name="ios-play"
            style={
              this.props.message.userId === this.props.user.id
                ? styles.senderBubble
                : styles.receiverBubble
            }
            onPress={() => this.playSound()}
          />
        ) : (
          <Icon
            name="ios-play"
            style={
              this.props.message.userId === this.props.user.id
                ? styles.senderBubblePlaying
                : styles.receiverBubblePlaying
            }
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  senderBubble: {
    left: 90,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    backgroundColor: 'transparent'
  },
  receiverBubble: {
    left: 25,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    backgroundColor: 'transparent'
  },
  senderBubblePlaying: {
    left: 90,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    backgroundColor: 'transparent',
    color: 'red'
  },
  receiverBubblePlaying: {
    left: 25,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    backgroundColor: 'transparent',
    color: 'red'
  }
})
