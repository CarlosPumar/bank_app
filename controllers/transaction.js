const transactionRouter = require('express').Router();
const Connection = require('../models/connection');
const User = require('../models/user');
const Transaction = require('../models/transaction');

// create transaction
transactionRouter.post('/', async (request, response, next) => {
  /*
    previus login required
        {
            "acountNumber": value,
            "value": value
        }

    */
  if (!response.locals.user)
    next({
      name: 'JsonWebTokenError',
    });

  const { body } = request;

  const fromUser = response.locals.user;
  const toUser = await User.findOne({ accountNumber: body.accountNumber });

  const connection1 = await Connection.findOne({
    fromUser: fromUser.id,
    toUser: toUser.id,
  });
  const connection2 = await Connection.findOne({
    toUser: fromUser.id,
    fromUser: toUser.id,
  });

  // Connection list
  if (
    !(
      connection1 &&
      connection2 &&
      connection1.state === 'accepted' &&
      connection2.state === 'accepted'
    )
  )
    return next({
      name: 'IncorrectTransaction',
    });

  // No te puedes enviar dinero a ti
  if (fromUser.id === toUser.id)
    return next({
      name: 'IncorrectTransaction',
    });

  // Balance insuficiente
  if (fromUser.balance - body.value < 0)
    return next({
      name: 'IncorrectTransaction',
    });

  fromUser.balance -= body.value;
  await User.findByIdAndUpdate(fromUser.id, fromUser);

  toUser.balance += body.value;
  await User.findByIdAndUpdate(toUser.id, toUser);

  const newTransaction = new Transaction({
    fromUser: fromUser.id,
    toUser: toUser.id,
    value: body.value,
  });

  const savedTransaction = await newTransaction.save();
  return response.json(savedTransaction);
});

module.exports = transactionRouter;
