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
import { connect } from 'react-redux'
import {url} from '../secrets'
import axios from 'axios'
import CustomHeader from './CustomHeader'

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
    this.state = {}
  }

  async getPictures() {
    const {data} = await axios.post(url + '/graphql', {
      query: `
        query{
          allUsers(userId: ${this.props.user.id}, targetId: ${2}, numPeople: ${20}) {
            id,
            profilePicture,
            fullName,
          }
        }
        `
    })
    console.log(data.data.allUsers)
  }

  render() {
    this.getPictures()
    return (
      <Container style={{backgroundColor: '#343434'}}>
        <CustomHeader title='picture picker' />
        <View>
          <DeckSwiper
            dataSource={[this.props.user]}
            renderItem={item => (
              <Card style={{elevation: 3}}>
                <CardItem style={{backgroundColor: "#FF43A4"}}>
                  <Left>
                    <Thumbnail source={{uri: item.profilePicture}} />
                    <Body>
                      <Text style={{color:'white'}}>{item.fullName}</Text>
                      <Text note>NativeBase</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  <Image style={{height: 300, flex: 1}} source={{uri: item.profilePicture}} />
                </CardItem>
                <CardItem style={{backgroundColor: "#FF43A4"}}>
                  <Icon name="heart" style={{color: '#ED4A6A'}} />
                  <Text style={{color:'white'}}>{item.fullName}</Text>
                </CardItem>
              </Card>
            )}
          />
        </View>
      </Container>
    )
  }
}

export default connect(({user})=>({user}))(PicturePicker)
