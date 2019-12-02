const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLFloat,
  GraphQLList
} = require('graphql')
const db = require('../db/db')
const Op = require('sequelize').Op
const Distance = require('geo-distance')
const turf = require('@turf/turf')
const point = require('turf-point')
const {User, Chat, Message, Meeting} = require('../db/models')

;(async function hi() {
  const user = await User.findByPk(1)
  console.log('iPrefer outside scope', user.iPrefer)
})()
//Type Definitions for GraphQL(what info should graphql expect from each model)
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLInt},
    email: {type: GraphQLString},
    fullName: {type: GraphQLString},
    googleId: {type: GraphQLString},
    gender: {type: GraphQLString},
    age: {type: GraphQLString},
    password: {type: GraphQLString},
    homeLocation: {type: new GraphQLList(GraphQLFloat)},
    incentivePoints: {type: GraphQLInt},
    profilePicture: {type: GraphQLString},
    chats: {type: new GraphQLList(ChatType)},
    messages: {type: new GraphQLList(MessageType)},
    iAm: {type: GraphQLString},
    iPrefer: {type: new GraphQLList(GraphQLString)},
    distPref: {type: GraphQLInt}
  })
})
const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    id: {type: GraphQLInt},
    content: {type: GraphQLString},
    length: {type: GraphQLInt},
    userId: {type: GraphQLInt},
    chatId: {type: GraphQLInt},
    createdAt: {type: GraphQLString},
    user: {type: UserType}
  })
})
const ChatType = new GraphQLObjectType({
  name: 'Chat',
  fields: () => ({
    id: {type: GraphQLInt},
    expirationDate: {type: GraphQLString},
    progress: {type: GraphQLFloat},
    status: {type: GraphQLString},
    meeting: {type: MeetingType},
    users: {type: new GraphQLList(UserType)},
    sinceCreation: {type: GraphQLFloat},
    messages: {type: new GraphQLList(MessageType)}
  })
})
const MeetingType = new GraphQLObjectType({
  name: 'Meeting',
  fields: () => ({
    location: {type: new GraphQLList(GraphQLFloat)},
    name: {type: GraphQLString},
    rating: {type: GraphQLFloat},
    address: {type: GraphQLString},
    date: {type: GraphQLString},
    chatId: {type: GraphQLInt},
    senderId: {type: GraphQLInt}
  })
})
const InvitationType = new GraphQLInputObjectType({
  name: 'Invitation',
  fields: () => ({
    coords: {type: new GraphQLList(GraphQLFloat)},
    name: {type: GraphQLString},
    address: {type: GraphQLString},
    rating: {type: GraphQLFloat},
    date: {type: GraphQLString}
  })
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
          include: [{model: db.models.chat}, {model: db.models.message}]
        })
        return data
      }
    },
    user: {
      type: UserType,
      args: {
        id: {type: GraphQLInt}
      },
      async resolve(parent, args) {
        return await db.models.user.findByPk(args.id, {
          include: [{model: db.models.chat}]
        })
      }
    },
    userLogin: {
      type: UserType,
      args: {
        email: {type: GraphQLString},
        password: {type: GraphQLString}
      },
      async resolve(parent, args) {
        let usermodel = await db.models.user.findOne({
          where: {email: args.email}
          // where: { email: args.email, password: args.password },
        })
        console.log('PASSWORD', args.password)
        console.log(usermodel.correctPassword(args.password))

        console.log('USERMODEL', usermodel)
        if (!usermodel) {
          console.log('No such user found:', args.email)
          alert('Wrong username')
        } else if (!usermodel.correctPassword(args.password)) {
          console.log('Incorrect password for user:', args.email)
          alert('Wrong password')
        } else {
          // console.log('PASSWORD', usermodel.cryptPassword(args.password))
          let use = await db.models.user.findOne({
            where: {
              email: args.email,
              password: usermodel.cryptPassword(args.password)
            }
          })
          console.log('USER', use)
          return use
        }
      }
    },
    myChats: {
      type: new GraphQLList(ChatType),
      args: {
        userId: {type: GraphQLInt}
      },
      async resolve(parent, args) {
        try {
          let user = await db.models.user.findByPk(args.userId)
          console.log('TCL: user', user)
          const chats = await user.getChats({
            include: [{model: db.models.user}, {model: db.models.message}]
          })
          console.log('TCL: chats.users', chats[0].users)
          return chats
        } catch (e) {
          console.error(e)
        }
      }
    },
    messages: {
      type: new GraphQLList(MessageType),
      args: {
        chatId: {type: GraphQLInt}
      },
      async resolve(parent, args) {
        try {
          const messages = await db.models.message.findAll({
            where: {chatId: args.chatId},
            include: [db.models.user],
            order: [['createdAt', 'DESC']]
          })
          return messages
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
})

const rootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  type: 'Mutation',
  fields: {
    userSignup: {
      type: UserType,
      args: {
        fullName: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString}
      },
      async resolve(parent, args) {
        console.log('ARGS', args)

        const data = await db.models.user.create({
          fullName: args.fullName,
          email: args.email,
          password: args.password
        })

        console.log('CREATED USER', data)
        if (data) {
          return data
        }
      }
    },
    deleteChat: {
      type: ChatType,
      args: {
        chatId: {type: GraphQLInt}
      },
      async resolve(parent, args) {
        console.log('in delete chat')
        let chat = await db.models.chat.findByPk(args.chatId)
        await chat.destroy()
        return chat
      }
    },
    findOrCreateChat: {
      type: ChatType,
      args: {
        userId: {type: GraphQLInt}
      },
      async resolve(parent, args) {
        let chosen
        const user = await User.findByPk(args.userId)
        console.log(
          'TCL: iPrefer in schema',
          user.iPrefer,
          'typeof',
          typeof user.iPrefer
        )
        console.log(user.fullName)
        const formatted = Array.isArray(user.iPrefer)
          ? user.iPrefer
          : user.iPrefer.slice(1, -1).split(',')
        console.log(formatted)
        const chats = await db.models.chat.findAll({
          include: {
            model: db.models.user,
            where: {
              id: {[Op.ne]: args.userId},
              iPrefer: {[Op.contains]: [user.iAm]},
              iAm: {[Op.in]: formatted}
            }
          },
          where: {
            status: 'pending'
          }
        })

        let filtered = []
        if (chats.length) {
          filtered = chats.filter(cur => {
            if (cur.users[0]) {
              const to = point(user.homeLocation)
              const from = point(cur.users[0].homeLocation)

              const options = {units: 'miles'}
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
          chosen = await chosen.update({status: 'active'})
        } else {
          chosen = await db.models.chat.create({
            expirationDate: '12-25-2019',
            progress: 0,
            status: 'pending',
            meeting: null
          })
        }
        console.log('TCL: chosen', chosen)

        await user.addChat(chosen)
        const updated = await db.models.chat.findByPk(chosen.id, {
          include: [db.models.user]
        })
        return updated
      }
    },
    newMessage: {
      type: MessageType,
      args: {
        content: {type: GraphQLString},
        length: {type: GraphQLInt},
        userId: {type: GraphQLInt},
        chatId: {type: GraphQLInt}
      },
      async resolve(parent, args) {
        const message = await db.models.message.create({...args})
        const createdMessage = await db.models.message.findByPk(message.id, {
          include: [db.models.user]
        })
        return createdMessage
      }
    },
    newMeeting: {
      type: MeetingType,
      args: {
        chatId: {type: GraphQLInt},
        userId: {type: GraphQLInt},
        invitation: {type: InvitationType}
      },
      async resolve(parent, args) {
        try {
          const meeting = await db.models.meeting.create({
            location: args.invitation.coords,
            name: args.invitation.name,
            rating: args.invitation.rating,
            address: args.invitation.address,
            date: new Date(args.invitation.date),
            senderId: args.userId
          })
          const chat = await db.models.chat.findByPk(args.chatId)
          const updated = await meeting.setChat(chat)
          return updated
        } catch (error) {
          console.error('in newMeeting route: ', error)
        }
      }
    }
  }
})

//Mutation Requests(change information in the database)

module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation
})
