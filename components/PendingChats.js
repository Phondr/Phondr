import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Card, CardItem, Text, Button} from 'native-base'
import Modal from 'react-native-modal'
import {View, StyleSheet} from 'react-native'
const PendingChats = ({myChats, user}) => {
  const [modal, setModal] = useState(false)
  const pending = myChats.filter(chat => chat.status === 'pending')
  console.log('pending', pending, 'user', user)
  return (
    <Card>
      <CardItem header>
        <Text>Pending Chats</Text>
      </CardItem>
      <Modal
        style={styles.modal}
        coverScreen={false}
        isVisible={modal}
        onBackdropPress={() => {
          setModal(false)
        }}
      >
        <View style={{flex: 1}}>
          <Button bordered warning onPress={() => setModal(false)}>
            <Icon
              reversed
              style={{color: 'red'}}
              name="delete"
              type="AntDesign"
            />
            <Text>Cancel Chat</Text>
          </Button>

          <Button bordered success onPress={() => setModal(false)}>
            <Icon
              reversed
              style={{color: 'green'}}
              name="check"
              type="AntDesign"
            />
            <Text>Keep Chat</Text>
          </Button>
        </View>
      </Modal>

      {pending.map((cur, ind) => {
        return (
          <CardItem button onPress={() => setModal(true)} key={cur.id}>
            <Left>
              <Icon name="ellipsis1" type="AntDesign" />
            </Left>
            <Text>Pending Chat Created: {cur.sinceCreation || 0} min. ago</Text>
          </CardItem>
        )
      })}
    </Card>
  )
}

const styles = StyleSheet.create({
  model: {
    flex: 1,
    height: 200,
    width: 200,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect(({myChats}) => ({myChats}))(PendingChats)
