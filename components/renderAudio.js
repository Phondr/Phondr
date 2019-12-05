import React from 'react'
import {StyleSheet} from 'react-native'
import {View, Icon} from 'native-base'
import * as Permissions from 'expo-permissions'
import {Audio} from 'expo-av'

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
    try {
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
    } catch (err) {
      console.error(err)
    }
  }
  async playSound() {
    if (this.soundObject) {
      await this.soundObject.unloadAsync().catch(err => console.error(err))
    }
    this.soundObject = new Audio.Sound()
    this.setState({isPlaying: true})
    await this.soundObject
      .loadAsync(
        {
          uri: `${this.props.message.audio}`
        },
        {androidImplementation: 'MediaPlayer'}
      )
      .catch(err => {
        alert('Error has occured. Audio could not be loaded.')
        console.error(err)
      })
    await this.soundObject
      .playAsync()
      .then(async playbackStatus => {
        setTimeout(() => {
          this.soundObject.unloadAsync()
          this.setState({isPlaying: false})
        }, playbackStatus.durationMillis)
      })
      .catch(err => {
        alert('Error has occurred. Audio cannot be played')
        console.error(err)
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
