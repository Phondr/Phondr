const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  googleId: {
    type: Sequelize.STRING
  },
  fullName: {
    type: Sequelize.STRING
    // allowNull: false,
  },
  age: {
    type: Sequelize.INTEGER
    // allowNull: false,
  },
  homeLocation: {
    type: Sequelize.ARRAY(Sequelize.FLOAT)
    // allowNull: false,
  },
  incentivePoints: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  profilePicture: {
    type: Sequelize.STRING
  },
  iAm: {
    type: Sequelize.ENUM(['male', 'female', 'non-binary']),
    defaultValue: 'non-binary'
  },
  iPrefer: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  distPref: {
    type: Sequelize.INTEGER
  },
  // radius: {
  //   type: Sequelize.INTEGER,
  //   defaultValue: 0
  // }
  isNoob: {
    type: Sequelize.BOOLEAN
  },
  maxPhondnessAchieved: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  // console.log('P', this.password())
  // console.log('CRYPT', User.encryptPassword(candidatePwd, this.salt()))
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

User.prototype.cryptPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt())
}

/**
 * classMethods
 */

User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

User.beforeSave(user => {
  const prefs = ['male', 'female', 'non-binary']
  user.iPrefer.forEach(cur => {
    if (!prefs.includes(cur)) {
      throw new Error('pref must be list of male,female, or non-binary')
    }
  })
})
User.beforeCreate(user => {
  setSaltAndPassword(user)
  if (!user.iPrefer.length) {
    user.iPrefer = ['non-binary']
  }
})
User.beforeUpdate(setSaltAndPassword)
User.beforeBulkCreate(users => {
  users.forEach(setSaltAndPassword)
})
