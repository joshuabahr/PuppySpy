import { Container } from 'unstated';
import axios from 'axios';

class CamContainer extends Container {
  
  state = {
    availableCams: null,
    activeCam: null,
    updateName: '',
    updatePassword: ''
  }

  createCam({ userId, camName, password }) {
    axios.post(`api/cam/create`, {
      userId,
      camName,
      password,
      active: true  
    })
    .then((cams) => {
      this.setState({
        availableCams: cams
      })
    })
  }

  deleteCam() {

  } 

  retrieveAvailableCams() {

  }

  allowCamUser() {

  }




}

export default CamContainer;