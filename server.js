const colors = require('colors');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');

dotenv.config({ path: './config/config.env' });

const destinations = require('./routes/destinations');
const users = require('./routes/users');
const bookings = require('./routes/bookings');
const reviews = require('./routes/reviews');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/destinations', destinations);
app.use('/users', users);
app.use('/bookings', bookings);
app.use('/reviews', reviews);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
