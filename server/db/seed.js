const faker = require('faker')
const db = require('./db')
const {User, Chat, Message, Meeting} = require('./models')
const axios = require('axios')
const round = require('lodash.round')

// const SEED = 42070
// faker.seed(SEED)
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
      password: '123'
    })
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
    password: 'test'
  })
  for (let i = 0; i < 25; i++) {
    await createUser()
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
            } 
          }
        }
          `
    })

    console.log(`chat ${i}: ${JSON.stringify(findOrCreateChat)}`)
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
