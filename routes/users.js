const router = require('express').Router();
const User = require('../models/user.model');

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/register').post((req, res) => {
  const {username, password } = req.body;
  User.register(new User({ username }), password, function(err) {
    if (err) {
      res.status(400).json('Error: ' + err);
    }
    res.json('User registered!');
  });
});

// router.route('/login').post((req,res))

module.exports = router;