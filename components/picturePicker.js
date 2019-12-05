import React from 'react'
import {Dimensions, StyleSheet, Platform, Image} from 'react-native'
import {
  Container,
  Header,
  View,
  DeckSwiper,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Icon
} from 'native-base'
import {connect} from 'react-redux'
import {url} from '../secrets'
import axios from 'axios'
import {NavigationEvents} from 'react-navigation'
import Spinner from './Spinner'

const cards = [
  {
    text: 'Card One',
    name: 'One',
    image:
      'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/dc23cd051d2249a5903d25faf8eeee4c/BFV36537_CC2017_2IngredintDough4Ways-FB.jpg'
  }
]

class PicturePicker extends React.Component {
  constructor() {
    super()
    this.state = {
      pictures: [],
      loading: true
    }
    this.getPictures = this.getPictures.bind(this)
  }

  async getPictures() {
    let {data} = await axios.post(url + '/graphql', {
      query: `
        query{
          allUsers(userId: ${
            this.props.user.id
          }, targetId: ${2}, numPeople: ${20}) {
            id,
            profilePicture,
            fullName,
          }
        }
        `
    })
    const pictureData = data.data.allUsers
    const data2 = await axios.post(url + '/graphql', {
      query: `
        query{
          user(id: ${this.props.navigation.getParam('otherUserId').id}) {
            iAm,
            profilePicture,
            fullName,
          }
        }
        `
    })
    const otherUser = data2.data.data.user
    this.setState({pictures: [otherUser, ...pictureData]})
    this.setState({loading: false})
  }

  render() {
    if (this.state.loading) {
      return (
        <React.Fragment>
          <Spinner />
          <NavigationEvents onDidFocus={this.getPictures} />
        </React.Fragment>
      )
    }
    return (
      <Container>
        <Header />
        <View>
          <DeckSwiper
            dataSource={this.state.pictures || cards}
            key={this.state.pictures.length}
            renderItem={item => (
              <Card style={{elevation: 3}}>
                <CardItem>
                  <Left>
                    <Thumbnail source={{uri: item.profilePicture}} />
                    <Body>
                      <Text>
                        {this.props.navigation.getParam('otherUserId').fullName}
                      </Text>
                      <Text note>Phondr</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  <Image
                    style={{height: 300, flex: 1}}
                    source={{uri: item.profilePicture}}
                  />
                </CardItem>
                <CardItem>
                  <Icon name="heart" style={{color: '#ED4A6A'}} />
                  <Text>
                    {this.props.navigation.getParam('otherUserId').fullName}
                  </Text>
                </CardItem>
              </Card>
            )}
          />
        </View>
      </Container>
    )
  }
}

export default connect(({user}) => ({user}))(PicturePicker)
