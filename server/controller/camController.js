const Table = require('../models/tableModels');

const existed = { status: 'already exists' };

const createCam = (req, res) => {
  Table.Cam.create({
    camName: req.body.camName,
    password: req.body.password,
    userId: req.body.userId,
    active: req.body.active
  })
    .then(response => {
      res.status(201).send(response);
    })
    .catch(error => res.send(error));
};

const fetchActiveUserCams = (req, res) => {
  Table.User_Cam.findAll({
    where: {
      userId: req.params.userId
    },
    include: [
      {
        model: Table.Cam,
        where: { active: true }
      }
    ]
  })
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.send(error);
    });
};

const fetchAllUserCams = (req, res) => {
  Table.User_Cam.findAll({
    where: {
      userId: req.params.userId
    },
    include: [
      {
        model: Table.Cam
      }
    ]
  })
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.send(error);
    });
};

const fetchPersonalCams = (req, res) => {
  Table.User.findAll({
    include: [
      {
        model: Table.Cam,
        where: { userId: req.params.userId, active: true }
      }
    ]
  })
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.send(error);
    });
};

const updateCamName = (req, res) => {
  Table.Cam.update(
    {
      camName: req.body.camName
    },
    { where: { id: req.body.camId } }
  )
    .then(() => {
      res.status(201).send('successfully updated cam name ');
    })
    .catch(error => {
      res.send(error);
    });
};

const updateCamPassword = (req, res) => {
  Table.Cam.update(
    {
      password: req.body.password
    },
    { where: { id: req.body.camId } }
  )
    .then(() => {
      res.status(201).send('updated cam password');
    })
    .catch(error => {
      res.send(error);
    });
};

const addAllowedCam = (req, res) => {
  let user_Id;
  const cam_Id = req.body.camId;
  Table.User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      user_Id = user.dataValues.id;
    })
    .then(() => {
      Table.User_Cam.findOrCreate({
        where: {
          camId: cam_Id,
          userId: user_Id
        }
      }).spread((response, isCreated) => {
        if (isCreated) {
          res.status(201).send(response);
        } else {
          res.send(existed);
        }
      });
    })
    .catch(error => {
      res.send(error);
    });
};

const closeCam = (req, res) => {
  Table.Cam.update(
    {
      active: false
    },
    { where: { id: req.body.camId } }
  )
    .then(() => {
      res.status(201).send('cam closed');
    })
    .catch(error => {
      res.send(error);
    });
};

module.exports = {
  createCam,
  fetchAllUserCams,
  fetchPersonalCams,
  fetchActiveUserCams,
  updateCamName,
  updateCamPassword,
  addAllowedCam,
  closeCam
};
