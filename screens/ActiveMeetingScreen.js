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
  componentDidMount() {
    this.props.fetchMeetings(this.props.user.id)
  }
  static navigationOptions = {
    drawerIcon: ({tintColor}) => {
      return null
    }
  }
  render() {
    const {meetings} = this.props
    const {myChats, navigation} = this.props
    return (
      <Container>
        <ScrollView>
          <CustomHeader title="Active Chats" />
          <Content>
            {meetings.length ? (
              <ActiveComp preview={true} />
            ) : (
              <Card>
                <CardItem>
                  <Text>No Active Meetings</Text>
                </CardItem>
              </Card>
            )}
          </Content>
        </ScrollView>
      </Container>
    )
  }
}
export default connect(({meetings, user}) => ({meetings, user}), {
  fetchMeetings
})(ActiveScreen)
