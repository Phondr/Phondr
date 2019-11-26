import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Icon, Left, Card, CardItem, Text, Button} from 'native-base'
import Modal from 'react-native-modal'
import {View, StyleSheet} from 'react-native'
import {deleteChat} from '../redux/myChats'
const PendingChats = ({myChats, user, deleteChat}) => {
  const [modal, setModal] = useState(false)
  const [selectedChat, setSelectedChat] = useState({})
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
          <Button
            bordered
            warning
            onPress={() => {
              console.log('TCL: selectedChat.id', selectedChat.id)
              deleteChat(selectedChat.id, user.id)
              setModal(false)
            }}
          >
            <Icon
              reversed
              style={{color: 'red'}}
              name="delete"
              type="AntDesign"
            />
            <Text>End Chat</Text>
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
          <CardItem
            button
            onPress={() => {
              setModal(true)
              setSelectedChat(cur)
            }}
            key={cur.id}
          >
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

export default connect(({myChats}) => ({myChats}), {deleteChat})(PendingChats)
