// Server
const express = require('express');
const morgan = require('morgan');
// Auth
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const cors = require('cors');
// Database
const mongoose = require('mongoose');

require('dotenv').config();

// Init express
const app = express();
const port = process.env.PORT || 5000;

// Extension tools
app.use(morgan('dev'))
app.use(cors());
app.use(express.json());

// configuring connection to mongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }
);
// connecting to mongoDB
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// Routing
const usersRoutes = require('./routes/users');
const reviewsRoutes = require('./routes/reviews');

// Middleware
app.use('/users',usersRoutes);
app.use('/reviews',reviewsRoutes);

// starting the server on the port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
