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
  let progress = round(calcProgress(currentChat), 2)

  useEffect(() => {
    if (header) {
      setCurrentProgress(progress)
    }
  }, [currentChat.messages.length])

  return (
    <>
      <Content>
        <Left>
          {header == true ? (
            <Bar
              progress={currentProgress / 100}
              width={100}
              animated={false}
            />
          ) : (
            <Bar progress={progress / 100} width={100} animated={false} />
          )}
        </Left>
        <Body>
          <Text style={{color: 'blue'}}>{progress}%</Text>
        </Body>
        <Right />
      </Content>
    </>
  )
}

export default connect(({currentProgress}) => ({currentProgress}), {
  setCurrentProgress
})(ProgressBar)
