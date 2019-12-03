import React, {Component} from 'react'
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
import {ScrollView} from 'react-native'
import {View, StyleSheet} from 'react-native'
import CustomHeader from '../components/CustomHeader'

export class PendingMeetings extends Component {
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
      <Container style={{backgroundColor: '#343434'}}>
        <ScrollView>
          <CustomHeader title="Pending Meetings" />
          <Content>
            {/* {myChats.length ? (
              <PendingComp />
            ) : (
              <Card>
                <CardItem>
                  <Text>No Pending Meetings</Text>
                </CardItem>
              </Card>
            )} */}
          </Content>
        </ScrollView>
      </Container>
    )
  }
}

export default PendingMeetings
