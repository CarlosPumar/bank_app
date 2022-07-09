const userRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// TODO Users should be able to see there past transactions.
// TODO User should be able to see the name, age and bank account number of all their connections in a list.

// create user
userRouter.post('/', async (request, response) => {
  const { body } = request;

  const saltRounds = 10;
  const password = await bcrypt.hash(body.password, saltRounds);

  const accountNumber = Math.floor(Math.random() * 10 ** 10);

  const user = new User({
    firstName: body.firstName,
    lastName: body.lastName,
    age: body.age,
    balance: body.balance,
    password,
    accountNumber,
  });

  const savedUser = await user.save();
  return response.json(savedUser);
});

module.exports = userRouter;
