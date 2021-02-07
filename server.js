// Server
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// Auth
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.model');
// Database
const mongoose = require('mongoose');
const MongoDBStore = require("connect-mongo")(session);

require('dotenv').config();

// connecting to mongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// Init express
const app = express();
const port = process.env.PORT || 5000;

// Extension tools
app.use(morgan('dev'))
app.use(cors());
app.use(express.json());

// Session
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = new MongoDBStore({
    url: uri,
    secret,
    touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e)
})
const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routing
const usersRoutes = require('./routes/users');
const reviewsRoutes = require('./routes/reviews');

app.use('/users',usersRoutes);
app.use('/reviews',reviewsRoutes);

// starting the server on the port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
