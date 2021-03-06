import React, {useEffect, useState} from 'react'
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
import {setCurrentProgress} from '../redux/currentProgress'
const ProgressBar = ({
  currentChat,
  currentProgress,
  header = false,
  navigation,

  setCurrentProgress
}) => {
  let progress = round(calcProgress(currentChat), 2) || 0

  useEffect(() => {
    if (header) {
      setCurrentProgress(progress)
    }
  }, [currentChat.messages])
  return (
    <>
      <Content>
        <Left>
          {header == true ? (
            <Bar
              progress={currentProgress / 100}
              width={100}
              animated={false}
              color = {'#75c6e5'}
            />
          ) : (
            <Bar progress={progress / 100} width={100} animated={false} color={'#75c6e5'}/>
          )}
        </Left>
        <Body>
          <Text style={{color: '#75c6e5'}}>{progress}%</Text>
        </Body>
        <Right />
      </Content>
    </>
  )
}

export default connect(({currentProgress}) => ({currentProgress}), {
  setCurrentProgress
})(ProgressBar)
