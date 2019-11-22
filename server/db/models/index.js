const User = require('./user')
const Chat = require('./chat')
const Message = require('./message')
const Meeting = require('./meeting')
/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */
User.belongsToMany(Chat, {through: 'userChats'})
Chat.belongsToMany(User, {through: 'userChats'})
Message.belongsTo(User)
User.hasMany(Message)
Message.belongsTo(Chat)
Chat.hasMany(Message)
Meeting.belongsTo(Chat)
Chat.hasOne(Meeting)
/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Chat,
  Message,
  Meeting,
}