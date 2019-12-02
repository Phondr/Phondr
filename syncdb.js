const db = require('./server/db')
const faker = require('faker')

async function seed() {
  await db.sync({ force: true })
  try {
    await db.models.user.create({
      fullName: `Avaree Warrick`,
      age: 24,
      homeLocation: [
        faker.address.latitude(),
        faker.address.longitude(),
      ],
      incentivePoints: faker.random.number(),
      created_at: faker.date.recent(),
      profilePicture: faker.random.image(),
      email: 'test@test.com',
      password: 'test',
    })
    await db.models.user.create({
      fullName: `Mike Lim`,
      age: 23,
      homeLocation: [
        faker.address.latitude(),
        faker.address.longitude(),
      ],
      incentivePoints: faker.random.number(),
      created_at: faker.date.recent(),
      profilePicture: faker.random.image(),
      email: 'mike@email.com',
      password: '123',
    })
  } catch (e) {
    console.error(e)
  }
}
seed()
