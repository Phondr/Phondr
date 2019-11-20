const {GraphQLServer} = require('graphql-yoga')

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  },
  {
    id: 'link-1',
    url: 'www.howtographqlsfsfdasd.com',
    description: 'Fullstack tutorial for GraphQL'
  }
]

// 1

// 2
let idCount = links.length
const resolvers = {
  Query: {
    info: () => `This is the API of Phondr`,
    feed: () => links
    // id: ()=>
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }
      links.push(link)
      return link
    }
  }
}
console.log('ggjdk')
// 3
const server = new GraphQLServer({
  typeDefs: './server/schema.graphql',
  resolvers
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
