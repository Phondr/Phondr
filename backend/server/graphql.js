const {GraphQLServer} = require('graphql-yoga')
const {prisma} = require('./src/generated/prisma-client')

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
    feed: (root, args, context, info) => context.prisma.messages()
    // id: ()=>
  },
  Mutation: {
    post: (parent, args, context, info) => {
      return context.prisma.createMessage({
        description: args.description,
        postedBy: args.user
      })
    }
  }
}
console.log('ggjdk')
// 3
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {prisma}
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
