import React from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Card, CardItem, Text, Container, Content} from 'native-base'
import {ScrollView, Platform} from 'react-native'
import CustomHeader from '../components/CustomHeader'

import ActiveMeetingComp from '../components/ActiveMeetingComp'
import TabBarIcon from '../components/TabBarIcon'
import {withNavigation, NavigationEvents} from 'react-navigation'
import {fetchAllMeetings} from '../redux/meetings'
class ActiveScreen extends React.Component {
  constructor() {
    super()
  }
  componentDidMount() {
    this.props.fetchAllMeetings(this.props.user.id)
  }
  static navigationOptions = {
    drawerIcon: ({tintColor}) => {
      return null
    }
  }
  render() {
    const {meetings, navigation} = this.props

    return (
      <Container>
        {/* <NavigationEvents
        onWillFocus={payload => {
          fetchAllMeetings(user.id)
        }}
      /> */}
        <ScrollView>
          <CustomHeader title="Active Meetings" />
          <Content>
            {meetings.length ? (
              <ActiveMeetingComp />
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
  fetchAllMeetings
})(ActiveScreen)
