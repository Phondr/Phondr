import React from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Card, CardItem, Text, Container, Content} from 'native-base'
import {ScrollView, Platform} from 'react-native'
import CustomHeader from '../components/CustomHeader'
import TabBarIcon from '../components/TabBarIcon'

import PendingMeetingComp from '../components/PendingMeetingComp'

import {withNavigation, NavigationEvents} from 'react-navigation'
import {fetchAllMeetings} from '../redux/meetings'
class PendingScreen extends React.Component {
  constructor() {
    super()
  }
  componentDidMount() {
    this.props.fetchAllMeetings(this.props.user.id)
  }
  static navigationOptions = {
    drawerIcon: ({tintColor}) => {
      return null
    },
    tabBarLabel: 'Pending',
    tabBarIcon: ({focused}) => (
      <TabBarIcon focused={focused} name={'ellipsis1'} />
    )
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
          <CustomHeader title="Pending Meetings" />
          <Content>
            {meetings.length ? (
              <PendingMeetingComp />
            ) : (
              <Card>
                <CardItem>
                  <Text>No Pending Meetings</Text>
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
})(PendingScreen)
