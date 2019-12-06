const path = require('path')
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const session = require('express-session')
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./db')
const sessionStore = new SequelizeStore({db})
const PORT = process.env.PORT || 8080
const app = express()
const socketio = require('socket.io')
const graphHTTP = require('express-graphql')
const schema = require('./graphql/schema')
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

module.exports = app

// This is a global Mocha hook, used for resource cleanup.
// Otherwise, Mocha v4+ never quits after tests.
if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line no-undef
  after('close the session store', () => sessionStore.stopExpiringSessions())
}

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== 'production') require('../secrets')

// passport registration
passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))

  // compression middleware
  app.use(compression())

  // session middleware with passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my best friend is Cody',
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  // auth and api routes
  app.use('/auth', require('./auth'))
  app.use('/api', require('./api'))

  // static file-serving middleware
  // app.use(express.static(path.join(__dirname, '..', 'public')))

  // any remaining requests with an extension (.js, .css, etc.) send 404
  // app.use((req, res, next) => {
  //   if (path.extname(req.path).length) {
  //     const err = new Error('Not found')
  //     err.status = 404
  //     next(err)
  //   } else {
  //     next()
  //   }
  // })

  //use graphql
  app.use(
    '/graphql',
    graphHTTP({
      schema,
      graphiql: true,
      customFormatErrorFn: error => {
        const message = {
          message: error.message,
          locations: error.locations,
          stack: error.stack ? error.stack.split('\n') : [],
          path: error.path
        }
        console.log(message)
        return message
      }
    })
  )

  // sends index.html
  // app.use('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  // })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

io.on('connection', socket => {
  console.log('New user has connected')
  let rooms = []

  socket.on('subscribe-to-chat', ({chatId}) => {
    console.log(`You have joined chat room ${chatId}!`)
    socket.join(chatId)
    rooms.push(chatId)
    socket
      .to(chatId)
      .emit('loginLogoutMessage', {message: 'Another user has joined the room'})
  })

  socket.on('unsubscribe-to-chat', ({chatId}) => {
    console.log(`You have left chat room ${chatId}.`)
    socket.leave(chatId)
    rooms = rooms.filter((room)=>room!==chatId)
    socket
      .to(chatId)
      .emit('loginLogoutMessage', {message: 'A user has left the room'})
  })

  socket.on('subscribe-to-user-room', ({name}) => {
    console.log(`joined ${name}`)
    socket.join(name)
    rooms.push(name)
  })

  socket.on('sendMessage', ({message, chatId}) => {
    console.log(message)
    io.to(chatId).emit('receiveMessage', {message})
  })

  socket.on('sendNewChat', ({chat, otherUser})=>{
    console.log(chat) //Send only to other user that had that pending chat
    socket.to(`${otherUser.fullName}`).emit('receiveNewChat', {chat})
  })

  socket.on('sendNewMessageNotification', ({otherUser, user})=>{
    console.log(otherUser)
    io.of('/').in(`${1}`).clients((error, clients) => {
      if (error) throw error;
      console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
    });
    socket.to(`${otherUser.fullName}`).emit('receiveNewMessageNotification', {message: `Got a new message from ${user.fullName}`})
  })

  socket.on('disconnect', () => {
    console.log('User has left')
    rooms.map((room)=>{io.to(room).emit('loginLogoutMessage', {message: 'A user has left the room'})})
  })
})

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  server.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`))

  //   // set up our socket control center
  //   const io = socketio(server)
  //   require('./socket')(io)
}

const syncDb = () => db.sync()

async function bootApp() {
  await sessionStore.sync()
  await syncDb()
  await createApp()
  await startListening()
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp()
} else {
  createApp()
}
