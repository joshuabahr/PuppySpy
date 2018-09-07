const Table = require('../models/tableModels');

const signupUser = (req, res) => {
  console.log('signupUser req.body', req.body);
  Table.User.findOrCreate({
    where: {
      email: req.body.email
    },
    defaults: {
      name: req.body.name,
      phone: req.body.phone
    }
  })
    .spread((response, isCreated) => {
      if (isCreated) {
        res.status(201).send(response);
      } else {
        res.send(response);
      }
    })
    .catch(error => {
      console.error('error in signupUser ', error);
      res.send(error);
    });
};

const editUserProfile = (req, res) => {
  console.log('edit user profile ', req.body);
  Table.User.update(
    {
      phone: req.body.phone
    },
    {
      where: { id: req.params.userId }
      // returning: true,
      // plain: true
    }
  )
    .then(response => res.status(200).send(response[1].dataValues))
    .catch(error => res.send(error));
};

const fetchUserProfile = (req, res) => {
  Table.User.findOne({
    where: { id: req.params.userId }
  })
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => res.send(error));
};

module.exports = { signupUser, editUserProfile, fetchUserProfile };
