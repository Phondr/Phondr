import React from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Card, CardItem, Text, Container, Content} from 'native-base'
import {ScrollView, Platform} from 'react-native'
import CustomHeader from '../components/CustomHeader'
import {withNavigation} from 'react-navigation'
import ActiveComp from '../components/ActiveComp'
import TabBarIcon from '../components/TabBarIcon'
class ActiveScreen extends React.Component {
  constructor() {
    super()
  }
  static navigationOptions = {
    drawerIcon: ({tintColor}) => {
      return (
        <Icon
          name="chat"
          type="MaterialIcons"
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
          <CustomHeader title="Active Chats" />
          <Content>
            {myChats.length ? (
              <ActiveComp />
            ) : (
              <Card>
                <CardItem>
                  <Text style={{color:'white'}}>No Active Chats</Text>
                </CardItem>
              </Card>
            )}
          </Content>
        </ScrollView>
      </Container>
    )
  }
}
export default connect(({myChats, user}) => ({myChats, user}))(ActiveScreen)
