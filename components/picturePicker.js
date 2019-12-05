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

const cards = [
  {
    text: 'Card One',
    name: 'One',
    image:
      'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/dc23cd051d2249a5903d25faf8eeee4c/BFV36537_CC2017_2IngredintDough4Ways-FB.jpg'
  }
]

export default class PicturePicker extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <Container>
        <Header />
        <View>
          <DeckSwiper
            dataSource={cards}
            renderItem={item => (
              <Card style={{elevation: 3}}>
                <CardItem>
                  <Left>
                    <Thumbnail source={{uri: item.image}} />
                    <Body>
                      <Text>{item.text}</Text>
                      <Text note>NativeBase</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  <Image style={{height: 300, flex: 1}} source={{uri: item.image}} />
                </CardItem>
                <CardItem>
                  <Icon name="heart" style={{color: '#ED4A6A'}} />
                  <Text>{item.name}</Text>
                </CardItem>
              </Card>
            )}
          />
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  ios: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'transparent',
    marginTop: Dimensions.get('window').height * 0.91,
    marginLeft: Dimensions.get('window').width * 0.9
  },
  android: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'transparent',
    marginTop: Dimensions.get('window').height * 0.87,
    marginLeft: Dimensions.get('window').width * 0.9
  }
})
