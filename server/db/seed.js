const faker = require('faker')
const db = require('./db')
<<<<<<< HEAD
const {User, Chat, Message, Meeting, userChats} = require('./models')

const SEED = 42070
faker.seed(SEED)
=======
const {User, Chat, Message, Meeting} = require('./models')
const axios = require('axios')
const round = require('lodash.round')
const Op = require('sequelize').Op

// const SEED = 42070
// faker.seed(SEED)
const idents = ['male', 'female', 'non-binary']
const randomizer = num => {
  return Math.floor(Math.random() * (num + 1))
}
const randomSelector = array => {
  const cache = {}
  let result = []
  array.forEach(cur => {
    const odds = Math.random()
    if (odds < 0.5 && !cache[cur]) {
      result.push(cur)
    } else {
      cache[cur] = true
    }
  })
  return result
}
>>>>>>> 2ee4b63ae7cb3966c39f9c71c2601f800453d6c1
const createUser = async () => {
  try {
    let user = await User.create({
      fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
      age: faker.random.number(),
      homeLocation: [
        round(faker.address.latitude()),
        round(faker.address.longitude())
      ],
      incentivePoints: faker.random.number({max: 100}),
      created_at: faker.date.recent(),
      profilePicture: faker.random.image(),
      email: faker.internet.email(),
      password: '123',
      iAm: idents[randomizer(2)],
      iPrefer: [...randomSelector(idents)],
      distPref: randomizer(50)
    })
    console.log('iPrefer array', user.iPrefer)
    return user
  } catch (err) {
    console.log(err)
  }
}

const createMessages = async () => {
  try {
    let message = await Message.create({
      content: faker.random.words(),
      length: faker.random.number()
    })
    return message
  } catch (err) {
    console.log(err)
  }
}
<<<<<<< HEAD
const createChat = async () => {
  try {
    // const status = ['pending', 'active', 'closed']
    let chat = await Chat.create({
      expirationDate: faker.random.words(),
      progress: parseFloat((Math.random() * 100).toFixed(2)),
      created_at: faker.random.words(),
      status: 'pending'
    })
    return chat
  } catch (err) {
    console.log(err)
  }
}
const createuserChats = async num => {
  try {
    let CI = Math.ceil(Math.random() * 49)
    const data = await Chat.findByPk(CI)
    let count = data.count
    if (data.status === 'pending') {
      await userChats.create({
        userId: num,
        chatId: CI
      })
      if (count + 1 !== 2) {
        await data.update({count: count + 1}, {where: {chatId: CI}})
      } else {
        await data.update(
          {status: 'active', count: count + 1},
          {where: {chatId: CI}}
        )
      }
    }
  } catch (err) {
    console.log(err)
  }
}
=======
// const createChat = async () => {
//   try {
//     const status = ["pending", "active", "closed"];
//     let chat = await Chat.create({
//       expirationDate: faker.random.words(),
//       progress: parseFloat((Math.random() * 100).toFixed(2)),
//       created_at: faker.random.words(),
//       status: status[Math.floor(Math.random() * 2)]
//     });
//     return chat;
//   } catch (err) {
//     console.log(err);
//   }
// };
>>>>>>> 2ee4b63ae7cb3966c39f9c71c2601f800453d6c1

const createMeetings = async () => {
  try {
    let meeting = await Meeting.create({
      location: faker.address.streetAddress(),
      date: faker.random.words()
    })
    return meeting
  } catch (err) {
    console.log(err)
  }
}

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')
<<<<<<< HEAD
  console.log(`seeded successfully`)
  for (let i = 1; i < 50; i++) {
    await createUser()
    await createChat()
    await createMeetings()
    await createMessages()
  }
  for (let i = 1; i < 50; i++) {
    await createuserChats(i)
  }
  let UC = await userChats.findAll()
  for (let i = 1; i < 50; i++) {
    const num = Math.ceil(Math.random() * UC.length)
    let U = await User.findByPk(UC[num].userId)
    let C = await Chat.findByPk(UC[num].chatId)
    let M = await Message.findByPk(i)
    await U.addMessages(M)
    await C.addMessages(M)
  }
=======

  await User.create({
    fullName: `Avaree Warrick`,
    age: 24,
    homeLocation: [
      round(faker.address.latitude()),
      round(faker.address.longitude())
    ],
    incentivePoints: faker.random.number(),
    created_at: faker.date.recent(),
    profilePicture: faker.random.image(),
    email: 'test@test.com',
    password: 'test',
    iAm: idents[randomizer(2)],
    iPrefer: ['male', 'female'],
    distPref: randomizer(50)
  })
  for (let i = 0; i < 50; i++) {
    const user = await createUser()
    console.log('iPrefer in forloop', user.iPrefer)
    //await createChat();
    await createMeetings()
    await createMessages()
  }
  for (let i = 1; i < 10; i++) {
    const {
      data: {
        data: {findOrCreateChat}
      }
    } = await axios.post('http://localhost:8080/graphql', {
      query: `
        mutation{
          findOrCreateChat(userId:${i}){
            id
            users {
              id
              fullName
              iPrefer
            } 
          }
        }
          `
    })

    console.log(`chat ${i}: ${JSON.stringify(findOrCreateChat)}`)
  }
  console.log(`seeded successfully`)
>>>>>>> 2ee4b63ae7cb3966c39f9c71c2601f800453d6c1
}
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}
if (module === require.main) {
  runSeed()
}
module.exports = seed
