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

import {calcProgress} from '../util'
import {Bar} from 'react-native-progress'
import round from 'lodash.round'
const ProgressBar = ({currentChat = {}, navigation}) => {
  const progress = round(calcProgress(currentChat), 2)

  return (
    <>
      <Content >
        <Left>
          <Bar borderColor='#E60026' color='#E60026' progress={progress / 100} width={100} animated={false} />
        </Left>
        <Body>
          <Text style={{color:'#E60026'}}>{progress}%</Text>
        </Body>
        <Right />
      </Content>
    </>
  )
}

export default ProgressBar
