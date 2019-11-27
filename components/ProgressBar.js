import React from 'react'
import {connect} from 'react-redux'
import {
  Icon,
  Left,
  Card,
  CardItem,
  Text,
  Container,
  Content,
  Right,
  Body
} from 'native-base'
import {ScrollView} from 'react-native'
import CustomHeader from '../components/CustomHeader'
import {withNavigation} from 'react-navigation'
import {calcProgress} from '../util'
import {Bar} from 'react-native-progress'

const ProgressBar = ({currentChat, navigation}) => {
  console.log('currentChat', currentChat)
  const progress = calcProgress(currentChat)
  console.log('TCL: progress', progress)
  return (
    <>
      <Content>
        <Left>
          <Bar
            progress={progress}
            width={200}
            animated={true}
            animationType="decay"
          />
        </Left>
        <Body>
          <Text style={{color: 'blue'}}>{progress}%</Text>
        </Body>
        <Right />
      </Content>
    </>
  )
}

export default ProgressBar
