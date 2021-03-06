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
  //console.log('iPrefer outside scope', user.iPrefer)
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
    distPref: {type: GraphQLInt},
    isNoob: {type: GraphQLBoolean}
  })
})

const InvitationType = new GraphQLInputObjectType({
  name: 'Invitation',
  fields: () => ({
    coords: {type: new GraphQLList(GraphQLFloat)},
    link: {type: GraphQLString},
    imageRef: {type: GraphQLString},
    name: {type: GraphQLString},
    address: {type: GraphQLString},
    rating: {type: GraphQLFloat},
    date: {type: GraphQLString}
  })
})

const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    id: {type: GraphQLInt},
    content: {type: GraphQLString},
    length: {type: GraphQLInt},
    audio: {type: GraphQLString},
    imageRef: {type: GraphQLString},
    userId: {type: GraphQLInt},
    chatId: {type: GraphQLInt},
    meetingId: {type: GraphQLInt},
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
    link: {type: GraphQLString},
    imageRef: {type: GraphQLString},
    rating: {type: GraphQLFloat},
    address: {type: GraphQLString},
    date: {type: GraphQLString},
    chatId: {type: GraphQLInt},
    senderId: {type: GraphQLInt},
    id: {type: GraphQLInt},
    status: {type: GraphQLString},
    chat: {type: ChatType},
    users: {type: new GraphQLList(UserType)}
  })
})

//Query Requests(grab information from the database)
const rootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  type: 'Query',
  fields: {
    allUsers: {
      type: new GraphQLList(UserType),
      args: {
        numPeople: {type: GraphQLInt},
        userId: {type: GraphQLInt},
        targetId: {type: GraphQLInt},
      },
      async resolve(parent, args) {
        const data = args.numPeople
          ? await db.models.user.findAll({
              where: {
                id: {[Op.notIn]: [args.userId, args.targetId]},
              },
              include: [{model: db.models.chat}, {model: db.models.message}],
              limit: args.numPeople-1
            })
          : await db.models.user.findAll({
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
        console.log('args emmail', args.email.toLowerCase())
        let usermodel = await db.models.user.findOne({
          
          where: {email: args.email}
          // where: { email: args.email, password: args.password },
        })

        //console.log('PASSWORD', args.password)
        //console.log(usermodel.correctPassword(args.password))

        //console.log('USERMODEL', usermodel)
        if (!usermodel) {
          //console.log('No such user found:', args.email)
          alert('Wrong username')
        } else if (!usermodel.correctPassword(args.password)) {
          //console.log('Incorrect password for user:', args.email)
          alert('Wrong password')
        } else {
          // console.log('PASSWORD', usermodel.cryptPassword(args.password))
          let use = await db.models.user.findOne({
            where: {
              email: args.email,
              password: usermodel.cryptPassword(args.password)
            }
          })
          //console.log('USER', use)
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
          //console.log('TCL: user', user)
          const chats = await user.getChats({
            include: [{model: db.models.user}, {model: db.models.message}]
          })
          //console.log('TCL: chats.users', chats[0].users)
          return chats
        } catch (e) {
          console.error(e)
        }
      }
    },
    getCurrentChat: {
      type: ChatType,
      args: {
        chatId: {type: GraphQLInt}
      },
      async resolve(parent, args) {
        try {
          //console.log(args.chatId)
          let chat = await db.models.chat.findByPk(args.chatId, {
            include: [{model: db.models.user}, {model: db.models.message}]
          })
          //console.log('chat', chat)
          return chat
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
    },
    fetchMeeting: {
      type: MeetingType,
      args: {
        chatId: {type: GraphQLInt}
      },
      async resolve(parent, args) {
        try {
          const meeting = await db.models.meeting.findOne({
            where: {
              chatId: args.chatId
            }
          })
          return meeting
        } catch (error) {
          console.error('in newMeeting route: ', error)
        }
      }
    },
    getAllMeetings: {
      type: new GraphQLList(MeetingType),
      args: {
        userId: {type: GraphQLInt}
      },
      async resolve(parent, args) {
        try {
          let user = await db.models.user.findByPk(args.userId, {
            include: [db.models.meeting]
          })
          //console.log('user prototype', db.models.user.prototype)
          const meetings = await user.getMeetings({
            include: [
              {model: db.models.user},
              {
                model: db.models.chat,
                include: [{model: db.models.user}, {model: db.models.message}]
              }
            ]
          })
          //console.log('meetings in getAllMeetings', meetings)
          return meetings
          // console.log('TCL: user', user)
          // const chats = await user.getChats({
          //   include: [
          //     {model: db.models.user},
          //     {model: db.models.message},
          //     {model: db.models.meeting, include: [db.models.chat]}
          //   ]
          // })
          // const meetingsArray = chats.reduce((accum, cur) => {
          //   if (cur.meetings) {
          //     accum = [...accum, cur.meetings]
          //   }
          //   return accum
          // }, [])
          // return meetingsArray
        } catch (error) {
          console.error('in newMeeting route: ', error)
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
        password: {type: GraphQLString},
        iAm: {type: GraphQLString},
        age: {type: GraphQLInt},
        distPref: {type: GraphQLInt},
        iPrefer: {type: new GraphQLList(GraphQLString)},
        profilePicture: {type: GraphQLString},
        homeLocation: {type: new GraphQLList(GraphQLFloat)}
      },
      async resolve(parent, args) {
        //console.log('ARGS', args)

        const data = await db.models.user.create({
          fullName: args.fullName,
          email: args.email,
          password: args.password,
          iAm: args.iAm,
          age: args.age,
          iPrefer: args.iPrefer,
          distPref: args.distPref,
          profilePicture: args.profilePicture,
          homeLocation: args.homeLocation
        })

        //console.log('CREATED USER', data)
        if (data) {
          return data
        }
      }
    },
    editUser: {
      type: UserType,
      args: {
        fullName: {type: GraphQLString},
        id: {type: GraphQLInt},
        email: {type: GraphQLString},
        iAm: {type: GraphQLString},
        distPref: {type: GraphQLInt},
        age: {type: GraphQLInt}
      },
      async resolve(parent, args) {
        let User = await db.models.user.findByPk(args.id)

        let updateduser = await User.update({
          fullName: args.fullName,
          email: args.email,
          iAm: args.iAm,
          distPref: args.distPref,
          age: args.age
        })

        if (updateduser) {
          return updateduser
        }
      }
    },
    updateNoob: {
      type: UserType,
      args: {
        id: {type: GraphQLInt},
        isNoob: {type: GraphQLBoolean}
      },
      async resolve(parent, args) {
        let User = await db.models.user.findByPk(args.id)

        let updateduser = await User.update({
          isNoob: false
        })

        if (updateduser) {
          return updateduser
        }
      }
    },
    deleteChat: {
      type: ChatType,
      args: {
        chatId: {type: GraphQLInt}
      },
      async resolve(parent, args) {
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
        // console.log(
        //   'TCL: iPrefer in schema',
        //   user.iPrefer,
        //   'typeof',
        //   typeof user.iPrefer
        // )
        //console.log(user.fullName)
        const formatted = Array.isArray(user.iPrefer)
          ? user.iPrefer
          : user.iPrefer.slice(1, -1).split(',')
        //console.log(formatted)
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
              //console.log('distance human readable', distance)
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
        //console.log('TCL: chosen', chosen)

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
        audio: {type: GraphQLString},
        imageRef: {type: GraphQLString},
        userId: {type: GraphQLInt},
        chatId: {type: GraphQLInt},
        meetingId: {type: GraphQLInt}
      },
      async resolve(parent, args) {
        const message = await db.models.message.create({
          content: args.content,
          length: args.length,
          audio: args.audio,
          imageRef: args.imageRef,
          userId: args.userId,
          chatId: args.chatId
        })
        if (+args.meetingId !== 0) {
          const meeting = await db.models.meeting.findByPk(args.meetingId)
          await message.setMeeting(meeting)
        }
        const createdMessage = await db.models.message.findByPk(message.id, {
          include: [{model: db.models.user}, {model: db.models.meeting}]
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
            link: args.invitation.link,
            imageRef: args.invitation.imageRef,
            name: args.invitation.name,
            rating: args.invitation.rating,
            address: args.invitation.address,
            date: new Date(args.invitation.date),
            senderId: args.userId,
            status: 'pending'
          })
          const chat = await db.models.chat.findByPk(args.chatId, {
            include: [db.models.user]
          })
          //console.log('meeting prototype', db.models.meeting.prototype)
          await meeting.addUsers(chat.users)
          const updated = await meeting.setChat(chat)
          await chat.addMeeting(updated)
          return updated
        } catch (error) {
          console.error('in newMeeting route: ', error)
        }
      }
    },
    updateMeeting: {
      type: MeetingType,
      args: {
        meetingId: {type: GraphQLInt},
        status: {type: GraphQLString}
      },
      async resolve(parent, args) {
        try {
          const meeting = await db.models.meeting.findByPk(args.meetingId)
          const updated = await meeting.update({status: args.status})
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
