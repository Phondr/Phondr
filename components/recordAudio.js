import React from 'react'
import {Dimensions, StyleSheet, Platform} from 'react-native'
import {View, Text, Button, Icon} from 'native-base'
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
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
  }
  async componentDidMount() {
    const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
    if (audio.status === 'granted') {
      this.setState({hasAudioPermission: true})
    } else {
      alert('Cannot record audio because permision has been denied')
      console.log(
        'Cannot play/record audio because permision have been denied.'
      )
    }
    try {
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
  async startRecording() {
    this.recording = new Audio.Recording()
    try {
      await this.recording.prepareToRecordAsync({
        android: {
          extension: '.aac',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AAC_ADTS,
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
      alert('An error has occured. Cannot record audio')
      console.error(err)
    }
  }
  async stopRecording() {
    this.setState({isRecording: false})
    try {
      await this.recording.stopAndUnloadAsync()
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
          alert('Error has occured. Audio was not recorded properly.')
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
    } catch (err) {
      console.error(err)
    }
  }
  render() {
    return (
      <View style={Platform.OS === 'ios' ? Dimensions.get('window').height===812 ? styles.iosMike : styles.ios : styles.android}>
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

const styles = StyleSheet.create({
  ios: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'transparent',
    marginTop: Dimensions.get('window').height * 0.86,
    marginLeft: Dimensions.get('window').width * 0.9
  },
  iosMike: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'transparent',
    marginTop: Dimensions.get('window').height * 0.845,
    marginLeft: Dimensions.get('window').width * 0.9
  },
  android: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'transparent',
    marginTop: Dimensions.get('window').height * 0.87,
    marginLeft: Dimensions.get('window').width * 0.9
  }
})
