import { Container } from 'unstated';
import axios from 'axios';

class SetCamContainer extends Container {
  
  state = {
    personalCams: null,
    setActiveCam: null,
    updateName: '',
    updatePassword: '',
    allowUser: ''
  }

  handleInputChange (e) {
    const input = {};
    input[e.target.name] = e.target.value;
    this.setState(() => (
      input
    ))
  }

  createCam({ userId, camName, password }) {
    axios.post(`api/cam/create`, {
      userId,
      camName,
      password,
      active: true  
    })
    .then((response) => {
      this.setActiveCam(response)
    })
    .then(() => {
      this.createStream(this.state.setActiveCam)
    })
  }

  createStream(cam) {
    // socket.io and webRTC
  }

  deleteCam({ camId, userId }) {
    axios.put(`api/cam/close`, {
      camId
    })
    .then(() => {
      console.log('cam closed');
      this.retrievePersonalCams(userId);
    })
  } 

  retrievePersonalCams(userId) {
    axios.get(`api/cam/personal/${userId}`)
    .then((response) => {
      console.log('retrieving cams');
      // need function to handle returned cams
      this.setState({
        availableCams: response[0]
      })
    })
  }

  setActiveCam(cam) {
    this.setState({
      activeCam: cam
    })
  }

  allowCamUser({ camId, email }) {
    axios.post(`api/cam/adduser`, {
      camId,
      email
    })
    .then((response) => {
      console.log('allowed user access to cam ', response);
    })
  }




}

export default SetCamContainer;