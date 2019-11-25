const { User } = require("../db/models");

const checkGuest = async (req, res, next) => {
  if (!req.user) {
    const { email } = req.body.user;
    const user = await User.findOrCreate({
      where: { email }
    });
    req.user = { id: user.id, email };
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const passwordReset = async (req, res, next) => {
  if (!req.body.password) {
    next();
  } else {
    const user = await User.findByPk(req.user.id);
    if (!user.correctPassword(req.body.oldPassword)) {
      res.status(401).send("Your password was incorrect");
    } else {
      delete req.body.oldPassword;
      next();
    }
  }
};

module.exports = {
  checkGuest,
  isUser,
  passwordReset
};
