const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLList,
} = require('graphql')
const db = require('../db/db')
const Op = require('sequelize').Op
const Distance = require('geo-distance')
const turf = require('@turf/turf')
const point = require('turf-point')

//Type Definitions for GraphQL(what info should graphql expect from each model)
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    email: { type: GraphQLString },
    fullName: { type: GraphQLString },
    googleId: { type: GraphQLString },
    gender: { type: GraphQLString },
    age: { type: GraphQLString },
    homeLocation: { type: new GraphQLList(GraphQLFloat) },
    incentivePoints: { type: GraphQLInt },
    profilePicture: { type: GraphQLString },
    chats: { type: new GraphQLList(ChatType) },
    messages: { type: new GraphQLList(MessageType) },
  }),
})
const ChatType = new GraphQLObjectType({
  name: 'Chat',
  fields: () => ({
    id: { type: GraphQLInt },
    expirationDate: { type: GraphQLString },
    progress: { type: GraphQLFloat },
    status: { type: GraphQLString },
    meeting: { type: MeetingType },
    users: { type: new GraphQLList(UserType) },
  }),
})
const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    id: { type: GraphQLInt },
    content: { type: GraphQLString },
    length: { type: GraphQLInt },
  }),
})
const MeetingType = new GraphQLObjectType({
  name: 'Meeting',
  fields: () => ({
    location: { type: GraphQLString },
    date: { type: GraphQLString },
  }),
})
//Query Requests(grab information from the database)
const rootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  type: 'Query',
  fields: {
    allUsers: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        const data = await db.models.user.findAll({
          include: [{ model: db.models.chat }, { model: db.models.message }],
        })
        return data
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        return await db.models.user.findByPk(args.id, {
          include: [{ model: db.models.chat }],
        })
      },
    },
    userLogin: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        let user = await db.models.user.findOne({
          where: { email: args.email, password: args.password },
        })
        return user
      },
    },
    myChats: {
      type: new GraphQLList(ChatType),
      args: {
        userId: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        try {
          let user = await db.models.user.findByPk(args.userId)
          console.log('TCL: user', user)
          const chats = await user.getChats({ include: [db.models.user] })
          console.log('TCL: chats.users', chats[0].users)
          return chats
        } catch (e) {
          console.error(e)
        }
      },
    },
  },
})

const rootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  type: 'Mutation',
  fields: {
    userSignup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        fullName: { type: GraphQLString },
        gender: { type: GraphQLString },
        age: { type: GraphQLString },
        homeLocation: { type: new GraphQLList(GraphQLFloat) },
        profilePicture: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const data = await db.models.user.create(args)
        return data
      },
    },

    findOrCreateChat: {
      type: ChatType,
      args: {
        userId: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        let chosen
        const user = await db.models.user.findByPk(args.userId)
        console.log(user.fullName)

        const chats = await db.models.chat.findAll({
          where: {
            status: 'pending',
          },
          include: {
            model: db.models.user,
          },
        })
        let filtered = []
        if (chats.length) {
          filtered = chats.filter(cur => {
            if (cur.users[0]) {
              const to = point(user.homeLocation)
              const from = point(cur.users[0].homeLocation)

              const options = { units: 'miles' }
              // const location2 = {
              //   lat: cur.users[0].homeLocation[0],
              //   lon: cur.users[0].homeLocation[1],
              // }
              // const distance = Distance.between(
              //   location1,
              //   location2
              // ).human_readable()
              const distance = turf.distance(from, to, options)
              console.log('distance human readable', distance)
              if (distance < 10100134 && !cur.users.includes(user)) {
                return cur
              }
            }
          })
        }
        if (filtered.length) {
          chosen = filtered[Math.floor(Math.random() * filtered.length)]
          chosen = await chosen.update({ status: 'active' })
        } else {
          chosen = await db.models.chat.create({
            expirationDate: '12-25-2019',
            progress: 0,
            status: 'pending',
            meeting: null,
          })
        }

        await user.addChat(chosen)
        const updated = await db.models.chat.findByPk(chosen.id, {
          include: [db.models.user],
        })
        return updated
      },
    },
    userTest: {
      type: UserType,
      args: {
        email: {type: GraphQLString}
      },
       resolve(parent, args) {
        return db.models.user.findOne({where:{email: args.email}})
      }
    },
  }
})

//Mutation Requests(change information in the database)

module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
})
