const cookieParser = require('cookie-parser');
const colors = require('colors');
const connectDB = require('../config/db');
const dotenv = require('dotenv');
const errorHandler = require('../middleware/error');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config({ path: './config/config.env' });

connectDB();

const auth = require('../routes/auth');
const bookings = require('../routes/bookings');
const destinations = require('../routes/destinations');
const feedbacks = require('../routes/feedbacks');
const reviews = require('../routes/reviews');
const users = require('../routes/users');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://travelist09.netlify.app'],
  })
);

app.use(express.json());

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/auth', auth);
app.use('/bookings', bookings);
app.use('/destinations', destinations);
app.use('/feedbacks', feedbacks);
app.use('/reviews', reviews);
app.use('/users', users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
// const express = require('express');
// const app = express();

// app.get('/', (req, res) => res.send('Express on Vercel'));

// app.listen(5000, () => console.log('Server ready on port 3000.'));

// module.exports = app;
