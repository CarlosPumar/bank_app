const jwt = require('jsonwebtoken');
const User = require('../models/user');

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError' || error.name === 'UserValidation') {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  if (error.name === 'IncorrectConnection') {
    return response.status(401).json({ error: 'Incorrect Connection' });
  }

  if (error.name === 'IncorrectTransaction') {
    return response.status(401).json({ error: 'Incorrect Transaction' });
  }

  return next(error);
};

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get('authorization');
  let token = '';
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7);
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    return next({
      name: 'JsonWebTokenError',
    });
  }

  if (!token || !decodedToken.accountNumber) {
    response.locals.user = null;
    return next();
  }

  const user = await User.findOne({
    accountNumber: decodedToken.accountNumber,
  });
  response.locals.user = user;

  return next();
};

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
};
