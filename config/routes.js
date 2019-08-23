const axios = require('axios');

const { authenticate, getJwtToken } = require('../auth/authenticate');
const bcrypt = require('bcryptjs');
const usersModel = require('../database/model');

module.exports = server => {
  server.post('/api/auth/register', register);
  server.post('/api/auth/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

async function register(req, res) {
  const { username, password } = req.body;
  try {
    const digest = bcrypt.hashSync(password, 12);
    await usersModel
      .add({
        username: username,
        password: digest
      })
      .then(
        newUser =>
          res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            token: getJwtToken(newUser)
          })
        // res.status(201).json(newUser);
      );
  } catch (err) {
    res.status(500).json({ message: 'Could not register user.', error: err });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  usersModel
    .findByUsername(username)
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // req.session.username = username;
        res
          .status(200)
          .json({ message: `Welcome ${username}!`, token: getJwtToken(user) });
      } else res.status(401).json({ message: 'Invalid creds' });
    })
    .catch(err => {
      res.status(500).json({ message: 'Error logging in', error: err });
    });
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' }
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
