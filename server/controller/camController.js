const Table = require('../models/tableModels');

const existed = { status: 'already exists' };

const createCam = (req, res) => {
  Table.Cam.findOrCreate({
    where: {
      camName: req.body.camName,
      password: req.body.password,
      userId: req.body.userId,
      active: req.body.active
    }
  })
  .spread((response, isCreated) => {
    console.log('create cam response ', response.id);
    console.log('create cam isCreated ', isCreated);
    if (isCreated) {
      Table.User_Cam.findOrCreate({
        where: {
          userId: req.body.userId,
          camId: response.id
        }
      })
      res.status(201).send(response);
    } else {
      res.send(existed);
    }
  })
  .catch((error) => {
    res.send(error);
  })
}

const fetchUserCams = (req, res) => {
  Table.User.findAll({
    include: [
      {
        model: Table.Cam,
        where: { userId: req.params.userId, active: true }
      }
    ]
  })
  .then((response) => {
    res.status(200).send(response);
  })
  .catch((error) => {
    res.send(error);
  })
}

const addAllowedCam = (req, res) => {
  let user_Id;
  const cam_Id = req.body.camId;
  Table.User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then((user) => {
    user_Id = user.dataValues.id;
  })
  .then(() => {
    Table.User_Cam.findOrCreate({
      where: {
        camId: cam_Id,
        userId: user_Id
      }
    })
    .spread((response, isCreated) => {
      if (isCreated) {
        res.status(201).send(response);
      } else {
        res.send(existed);
      }
    })
  })
  .catch((error) => {
    res.send(error);
  })

}

const closeCam = (req, res) => {
  Table.Cam.update({
    active: false
  }, { where: { id: req.body.camId }})
  .then(() => {
    res.status(201).send('cam closed');
  })
  .catch((error) => {
    res.send(error);
  })
}

module.exports = { createCam, fetchUserCams, addAllowedCam, closeCam };