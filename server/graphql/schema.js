const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLList
} = require("graphql");
const db = require("../db/db");

//Type Definitions for GraphQL(what info should graphql expect from each model)
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLInt },
    email: { type: GraphQLString },
    fullName: { type: GraphQLString },
    googleId: { type: GraphQLString },
    gender: { type: GraphQLString },
    age: { type: GraphQLString },
    homeLocation: { type: GraphQLString },
    incentivePoints: { type: GraphQLInt },
    profilePicture: { type: GraphQLString },
    chats: { type: new GraphQLList(ChatType) },
    messages: { type: new GraphQLList(MessageType) }
  })
});
const ChatType = new GraphQLObjectType({
  name: "Chat",
  fields: () => ({
    id: { type: GraphQLInt },
    expirationDate: { type: GraphQLString },
    progress: { type: GraphQLFloat },
    status: { type: GraphQLString },
    meeting: { type: MeetingType }
  })
});
const MessageType = new GraphQLObjectType({
  name: "Message",
  fields: () => ({
    id: { type: GraphQLInt },
    content: { type: GraphQLString },
    length: { type: GraphQLInt }
  })
});
const MeetingType = new GraphQLObjectType({
  name: "Meeting",
  fields: () => ({
    location: { type: GraphQLString },
    date: { type: GraphQLString }
  })
});
//Query Requests(grab information from the database)
const rootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  type: "Query",
  fields: {
    allUsers: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        const data = await db.models.user.findAll({
          include: [{ model: db.models.chat }, { model: db.models.message }]
        });
        return data;
      }
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return db.models.user.findByPk(args.id, {
          include: [{ model: db.models.chat }]
        });
      }
    },
    userLogin: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args) {
        let use = await db.models.user.findOne({
          where: { email: args.email, password: args.password }
        });
        return use;
      }
    }
  }
});

//Mutation Requests(change information in the database)

module.exports = new GraphQLSchema({
  query: rootQuery
});
