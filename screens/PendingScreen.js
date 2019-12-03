import React, {useState} from 'react'
import {connect} from 'react-redux'
import {
  Icon,
  Left,
  Card,
  CardItem,
  Text,
  Button,
  Content,
  Container
} from 'native-base'
import Modal from 'react-native-modal'
import {View, StyleSheet} from 'react-native'
import {deleteChat} from '../redux/myChats'
import PendingComp from '../components/PendingComp'
import {ScrollView} from 'react-native'
import CustomHeader from '../components/CustomHeader'

class PendingScreen extends React.Component {
  constructor() {
    super()
  }
  static navigationOptions = {
    drawerIcon: ({tintColor}) => {
      return (
        <Icon
          name="ellipsis-h"
          type="FontAwesome"
          style={{fontSize: 24, color: tintColor}}
        ></Icon>
      )
    }
  }
  render() {
    const {myChats, navigation} = this.props

    return (
      <Container style={{backgroundColor:	'#343434'}}>
        <ScrollView>
          <CustomHeader title="Pending Chats" />
          <Content>
            {myChats.length ? (
              <PendingComp />
            ) : (
              <Card>
                <CardItem>
                  <Text style={{color:'white'}}>No Pending Chats</Text>
                </CardItem>
              </Card>
            )}
          </Content>
        </ScrollView>
      </Container>
    )
  }
}

export default connect(({myChats}) => ({myChats}))(PendingScreen)
