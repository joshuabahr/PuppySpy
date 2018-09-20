import { Container } from 'unstated';
import axios from 'axios';

class SetCamContainer extends Container {
  state = {
    personalCamList: null,
    personalActiveCam: null,
    updateName: '',
    updatePassword: '',
    allowUser: 'email',
    createNew: false,
    allowUserModal: false
  };

  handleInputChange = e => {
    const input = {};
    input[e.target.name] = e.target.value;
    this.setState(() => input);
  };

  createCam = (userId, camName, password) => {
    axios
      .post(`api/cam/create`, {
        userId,
        camName,
        password,
        active: true
      })
      .then(response => {
        this.setActiveCam(response.data);
      })
      .then(() => {
        this.setState({
          createNew: false
        });
      })
      .then(() => {
        this.retrievePersonalCams(userId);
      });
  };

  deleteCam = (camId, userId) => {
    console.log('delete cam camId ', camId);
    axios
      .put(`api/cam/close`, {
        camId
      })
      .then(() => {
        this.setState({
          personalActiveCam: null
        });
      })
      .then(() => {
        console.log('cam closed');
        this.retrievePersonalCams(userId);
      });
  };

  retrievePersonalCams = userId => {
    console.log('retrieve personal cams running ');
    axios.get(`api/cam/personal/${userId}`).then(response => {
      console.log('retrieving cams ', response);
      if (response.data.length === 0) {
        this.setState({
          personalCamList: null
        });
      } else {
        this.setState({
          personalCamList: response.data[0].cams
        });
      }
    });
  };

  setActiveCam = cam => {
    this.setState({
      personalActiveCam: cam
    });
  };

  setCreateCam = () => {
    this.setState({
      createNew: true
    });
  };

  allowCamUser = id => {
    const { allowUser } = this.state;
    axios
      .post(`api/cam/adduser`, {
        camId: id,
        email: allowUser
      })
      .then(response => {
        console.log('allowed user access to cam ', response);
      })
      .then(() => {
        this.setState({
          allowUser: '',
          allowUserModal: false
        });
      })
      .catch(error => console.log('error allowing user access ', error));
  };

  reloadAfterRemoteClose = userId => {
    this.setState({
      personalActiveCam: null
    }).then(() => {
      this.retrievePersonalCams(userId);
    });
  };

  handleModalShow = () => {
    this.setState({ allowUserModal: true });
  };

  handleModalClose = () => {
    this.setState({ allowUserModal: false });
  };
}

export default SetCamContainer;
