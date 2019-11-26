import React from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Card, CardItem, Text, Container, Content} from 'native-base'
import {ScrollView} from 'react-native'
import CustomHeader from '../components/CustomHeader'
import {withNavigation} from 'react-navigation'
import ActiveComp from '../components/ActiveComp'

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
      <Container>
        <ScrollView>
          <CustomHeader title="Active Chats" />
          <Content>
            {myChats.length ? (
              <ActiveComp preview={true} />
            ) : (
              <Card>
                <CardItem>
                  <Text>No Active Chats</Text>
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
