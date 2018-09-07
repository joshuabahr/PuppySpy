import { Container } from 'unstated';
import axios from 'axios';

// BUGS: deleteCam not working

class SetCamContainer extends Container {
  state = {
    personalCamList: null,
    personalActiveCam: null,
    updateName: '',
    updatePassword: '',
    allowUser: '',
    createNew: false
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
      if (response.data.length > 0) {
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

  allowCamUser = ({ camId, email }) => {
    axios
      .post(`api/cam/adduser`, {
        camId,
        email
      })
      .then(response => {
        console.log('allowed user access to cam ', response);
      });
  };
}

export default SetCamContainer;
