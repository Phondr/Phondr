const faker = require('faker')
const db = require('./db')
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
      profilePicture: faker.image.avatar(),
      email: faker.internet.email(),
      password: '123',
      iAm: idents[randomizer(2)],
      iPrefer: [...randomSelector(idents)],
      distPref: randomizer(50),
      isNoob: true
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
      length: faker.random.number(),
      userId: randomizer(10),
      chatId: randomizer(10)
    })
    return message
  } catch (err) {
    console.log(err)
  }
}
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

  const user1 = await User.create({
    fullName: `Kip Dynamite`,
    age: 24,
    homeLocation: [
      41.878112999999999,-87.6297990000000055
    ],
    incentivePoints: faker.random.number(),
    created_at: faker.date.recent(),
    profilePicture:
      'https://vignette.wikia.nocookie.net/napoleondynamite/images/0/04/Kip_Dynamite.jpg/revision/latest?cb=20120117222921',
    email: 'test@test.com',
    password: 'test',
    iAm: idents[randomizer(2)],
    iPrefer: ['male', 'female', 'non-binary'],
    distPref: randomizer(50),
    isNoob: true
  })
  const user2 = await User.create({
    fullName: `Mike Lim`,
    age: 24,
    homeLocation: [
      41.878112999999999,-87.6297990000000055
    ],
    incentivePoints: faker.random.number(),
    created_at: faker.date.recent(),
    profilePicture: faker.random.image(),
    email: 'mike@email.com',
    password: '123',
    iAm: idents[randomizer(2)],
    iPrefer: ['male', 'female', 'non-binary'],
    distPref: randomizer(50),
    isNoob: true
  })

  for (let i = 0; i < 50; i++) {
    const user = await createUser()

    //await createChat();
    //await createMeetings()
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
  for (let i = 0; i < 500; i++) {
    await createMessages()
  }
  let chat1 = await Chat.create({
    expirationDate: Date.now(),
    progress: parseFloat((Math.random() * 100).toFixed(2)),
    created_at: faker.random.words(),
    status: 'active'
  })
  chat1.addUsers([user1, user2])
  chat1.update({
    sinceCreation: (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
  })
  for (let i = 0; i < 9; i++) {
    await Message.create({
      content: faker.random.words(),
      length: faker.random.number(),
      userId: 1,
      chatId: chat1.id
    })
    await Message.create({
      content: faker.random.words(),
      length: faker.random.number(),
      userId: 2,
      chatId: chat1.id
    })
  }
  console.log(`seeded successfully`)
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
