const db = require('./server/db')

async function seed() {
  await db.sync({ force: true })
  try {
    await db.models.user.create({
      name: 'joe',
      email: 'fjsdfks@email.com',
      homeLocation: [-75.343, 39.984],
    })
    await db.models.user.create({
      name: 'dode',
      email: 'fjsdfddfks@email.com',
      homeLocation: [-75.534, 39.123],
    })
    await db.models.user.create({
      name: 'dsode',
      email: 'fjsdfddasdks@email.com',
      homeLocation: [-75.53, 39.209],
    })
  } catch (e) {
    console.error(e)
  }
}
seed()
