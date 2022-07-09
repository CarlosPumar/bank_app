const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loginRouter = require('express').Router();
const User = require('../models/user');

// login
loginRouter.post('/', async (request, response) => {
  const { body } = request;

  const user = await User.findOne({ accountNumber: body.accountNumber });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    accountNumber: user.accountNumber,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: '1h',
  });

  return response.status(200).send({
    token,
    firstName: user.firstName,
    lastName: user.lastName,
    accountNumber: user.accountNumber,
  });
});

module.exports = loginRouter;
