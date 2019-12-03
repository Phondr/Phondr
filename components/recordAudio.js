import React from 'react'
import {StatusBar, Dimensions} from 'react-native'
import {View, Text, Button, Icon} from 'native-base'
import CustomHeader from './CustomHeader'
import * as Permissions from 'expo-permissions'
import {Audio} from 'expo-av'
import {RNS3} from 'react-native-s3-upload'
import {amazonConfig} from '../secrets'

export default class RecordAudio extends React.Component {
  constructor() {
    super()
    this.state = {
      hasAudioPermission: false,
      isRecording: false
    }
    this.playSound = this.playSound.bind(this)
    this.stopSound = this.stopSound.bind(this)
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
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
      this.soundObject.unloadAsync()
    }
    this.soundObject = new Audio.Sound()
    await this.soundObject.loadAsync(
      {
        uri: `https://s3.us-east-2.amazonaws.com/phondr/uploads%2Ftest.aac`
      } || require('./iu.mp3')
    )
    await this.soundObject
      .playAsync()
      .then(async playbackStatus => {
        setTimeout(() => {
          this.soundObject.unloadAsync()
        }, playbackStatus.playableDurationMillis)
      })
      .catch(error => {
        console.log(error)
      })
  }
  stopSound() {
    this.soundObject.unloadAsync()
  }
  async startRecording() {
    this.recording = new Audio.Recording()
    try {
      await this.recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000
        },
        ios: {
          extension: '.aac',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false
        }
      })
      this.setState({isRecording: true})
      await this.recording.startAsync()
    } catch (err) {
      console.error(err)
    }
  }
  async stopRecording() {
    this.setState({isRecording: false})
    this.recording.stopAndUnloadAsync()
    console.log(this.recording.getURI())
    this.uri = await this.recording.getURI()
    RNS3.put(
      {
        uri: this.uri,
        name: `Chat-${this.props.chat.id}-Message-${this.props.messageLength +
          1}.aac`,
        type: `audio/aac`
      },
      amazonConfig
    ).then(response => {
      if (response.status !== 201) {
        throw new Error('Failed to upload image to S3')
      }
      const formattedMessage = [
        {
          text: '',
          audio: response.headers.Location,
          user: {_id: this.props.user.id}
        }
      ]
      this.props.onSend(formattedMessage)
    })
  }
  render() {
    return (
      <View
        style={{
          // alignSelf: 'center',
          position: 'absolute',
          zIndex: 2,
          backgroundColor: 'transparent',
          marginTop: Dimensions.get('window').height * 0.91,
          marginLeft: Dimensions.get('window').width * 0.9
        }}
      >
        {this.state.isRecording === false ? (
          <Icon
            name="ios-mic"
            style={{alignSelf: 'center', fontSize: 40}}
            onPress={() => this.startRecording()}
          />
        ) : (
          <Icon
            name="mic-off"
            style={{alignSelf: 'center', color: 'red', fontSize: 40}}
            onPress={() => this.stopRecording()}
          />
        )}
      </View>
    )
  }
}
