const faker = require('faker')
const db = require('./db')
const {User, Chat, Message, Meeting, userChats} = require('./models')

const SEED = 42070
faker.seed(SEED)
const createUser = async () => {
  try {
    let user = await User.create({
      fullName: `${faker.name.firstName()}` + ` ${faker.name.lastName()}`,
      age: faker.random.number(),
      homeLocation: faker.address.streetAddress(),
      incentivePoints: faker.random.number(),
      created_at: faker.date.recent(),
      profilePicture: faker.random.image(),
      email: faker.internet.email(),
      password: faker.internet.password()
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
    const num = Math.ceil(Math.random() * 45)
    let U = await User.findByPk(UC[num].userId)
    let C = await Chat.findByPk(UC[num].chatId)
    let M = await Message.findByPk(i)
    await U.addMessages(M)
    await C.addMessages(M)
  }
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
