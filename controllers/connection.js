const connectionRouter = require('express').Router();
const User = require('../models/user');
const Connection = require('../models/connection');

// create connection
connectionRouter.post('/', async (request, response, next) => {
  if (!response.locals.user)
    return next({
      name: 'JsonWebTokenError',
    });

  const { body } = request;

  const toUser = await User.findOne({ accountNumber: body.accountNumber });

  if (response.locals.user.id === toUser.id)
    return next({
      name: 'IncorrectConnection',
    });

  const newConnection = new Connection({
    fromUser: response.locals.user.id,
    toUser: toUser.id,
    state: 'wating',
  });

  const savedConnection = await newConnection.save();
  return response.json(savedConnection);
});

// accept connection
connectionRouter.patch('/accept/:id', async (request, response, next) => {
  const id = String(request.params.id);

  if (!response.locals.user)
    return next({
      name: 'JsonWebTokenError',
    });

  const connection = await Connection.findById(id);

  if (response.locals.user.id !== connection.fromUser.toString())
    return next({
      name: 'IncorrectConnection',
    });

  connection.state = 'accepted';
  await Connection.findByIdAndUpdate(id, connection);

  return response.json(connection);
});

// delete connection
connectionRouter.delete('/:id', async (request, response, next) => {
  const id = String(request.params.id);

  if (!response.locals.user)
    return next({
      name: 'JsonWebTokenError',
    });

  const connection = await Connection.findById(id);

  if (response.locals.user.id !== connection.fromUser.toString())
    return next({
      name: 'IncorrectConnection',
    });

  const result = await Connection.findByIdAndDelete(id);
  return response.json(result);
});

module.exports = connectionRouter;
