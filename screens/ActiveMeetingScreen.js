import React from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Card, CardItem, Text, Container, Content} from 'native-base'
import {ScrollView, Platform} from 'react-native'
import TabBarIcon from '../components/TabBarIcon'
import ActiveMeetingComp from '../components/ActiveMeetingComp'

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
      <Container style= {{backgroundColor:'#343434'}}>
        {/* <NavigationEvents
        onWillFocus={payload => {
          fetchAllMeetings(user.id)
        }}
      /> */}
        <ScrollView>
          <Content >
            {meetings.length ? (
              <ActiveMeetingComp />
            ) : (
              <Card>
                <CardItem style={{backgroundColor:'#FF91AF'}}>
                  <Text style={{color:'white'}}>No Active Meetings</Text>
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
