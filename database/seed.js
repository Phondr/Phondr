const faker = require('faker')
const db = require('../server/db')
const {users, Chat, Messages, Meeting} = require('/')

const createUser = async () => {
  try {
    const gen = Math.ceil(Math.random() * 1)
    let user = await users.create({
      full_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      gender: gen ? 'M' : 'F',
      age: faker.random.number(),
      homeLocation: faker.address.streetAddress(),
      incentivePoints: faker.random.number(),
      created_at: faker.date.recent(),
      profilePicture: faker.random.image()
    })
    return user
  } catch (err) {
    next(err)
  }
// }
// const createUserMessage =async () =>{
//   try {

//   } catch (err) {
//     next(err)
//   }
// }
const createMessages = async () => {
  try {
    let message = await Messages.create({
      content: faker.random.number(),
      length: faker.random.number(),
      userId: faker.random.number(),
      chatId: faker.random.number()
    })
    return message
  } catch (err) {
    next(err)
  }
}
const createChat = async () => {
  try {
    let chat = await Chat.create({
      experationDate: faker.random.words(),
      progress: faker.random.number(),
      created_at: faker.random.words(),
      status: faker.random.number()
    })
  } catch (err) {
    next(err)
  }
}

const createMeetings = async () => {
  try {
    let meeting = await Meeting.create({
      location: faker.address.streetAddress(),
      date: faker.random.words(),
      // chatId: faker.random.number()
    })
    return meeting
  } catch (err) {
    next(err)
  }
}

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')
  console.log(`seeded successfully`)
  for(let i = 0; i<100;i++){
    await createUser()
  }
}
module.exports = seed
