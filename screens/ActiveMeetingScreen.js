import React from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Card, CardItem, Text, Container, Content} from 'native-base'
import {ScrollView, Platform} from 'react-native'
import TabBarIcon from '../components/TabBarIcon'
import ActiveMeetingComp from '../components/ActiveMeetingComp'

import {withNavigation, NavigationEvents} from 'react-navigation'
import {fetchAllMeetings} from '../redux/meetings'
import Spinner from '../components/Spinner'
class ActiveScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      loading: true
    }
  }
  // async componentDidMount() {
  //   await this.props.fetchAllMeetings(this.props.user.id)
  //   this.setState({loading: false})
  // }
  static navigationOptions = {
    drawerIcon: ({tintColor}) => {
      return null
    }
  }
  render() {
    const {meetings, navigation, fetchAllMeetings, user} = this.props
    if (this.state.loading) {
      return (
        <React.Fragment>
          <Spinner />
          <NavigationEvents
            onDidFocus={async payload => {
              this.setState({loading: true})
              await fetchAllMeetings(user.id)
              this.setState({loading: false})
            }}
          />
        </React.Fragment>
      )
    }
    return (
      <Container style= {{backgroundColor:'#343434'}}>
        <NavigationEvents
          onDidFocus={async payload => {
            this.setState({loading: true})
            await fetchAllMeetings(user.id)
            this.setState({loading: false})
          }}
        />
        <ScrollView>
          <Content >
            {meetings.length ? (
              <ActiveMeetingComp
                setParent={this.setState.bind(this)}
                loading={this.state.loading}
              />
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
