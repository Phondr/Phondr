import {isContext} from 'vm'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {APP_SECRET, getUserId} = require('../util')

async function signup(parent, args, content, info) {
  //1
  const password = await bcrypt.hash(args.password, 10)
  //2
  const user = await isContext.prisma.createUser({...args, password})
  //3
  const token = jwt.sign({userId: user.id}, APP_SECRET)
  //4
  return {
    token,
    user
  }
}

async function login(parent, args, context, info) {
  // 1
  const user = await context.prisma.user({email: args.email})
  if (!user) {
    alert('No such user found')
    throw new Error('No such user found')
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    alert('Invalid Password')
    throw new Error('Invalid password')
  }

  const token = jwt.sign({userId: user.id}, APP_SECRET)

  // 3
  return {
    token,
    user
  }
}

module.exports = {
  signup,
  login,
  post
}
