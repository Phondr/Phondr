import ApolloClient from 'apollo-boost'
const { url } = require('../secrets')


const client = new ApolloClient({ uri: url + '/graphql' })

export default client
