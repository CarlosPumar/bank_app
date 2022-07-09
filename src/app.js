const express = require('express');

const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/user');
const connectionsRouter = require('./controllers/connection');
const transactionsRouter = require('./controllers/transaction');
const middleware = require('./utils/middleware');
const config = require('./utils/config');

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/connections', connectionsRouter);
app.use('/api/transactions', transactionsRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
