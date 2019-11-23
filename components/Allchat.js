import React, { Component } from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
} from 'native-base';
import { ScrollView, View } from 'react-native';
// import {gql} from 'apollo-boost'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
const email = 'mike@email.com'
const query = gql`
  {
    userTest(email: "mike@email.com") {
      id
      email
      fullName
    }
  }
`;

export default class AllChats extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Query query={query}>
              {({ loading, error, data }) => {
                console.log('loading', loading);
                console.log('error', error);
                console.log(data);
                return <Text>hiiii</Text>;
              }}
            </Query>
            <Title>These are all my preys</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <ScrollView>
            <View>
              <Text>
                This will be where the list of the chats be. Each chat will have
                its own progress bar
              </Text>
            </View>
          </ScrollView>
          <Button small primary style={{ width: '30%', alignSelf: 'center' }}>
            <Text>Test me</Text>
          </Button>
        </Content>
        <Footer>
          <FooterTab>
            <Button full>
              <Text>Search for another chat</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
