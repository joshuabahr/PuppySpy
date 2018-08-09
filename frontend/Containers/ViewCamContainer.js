import { Container } from 'unstated';
import axios from 'axios';

class ViewCamContainer extends Container {
  state = {
    camList: null,
    activeCam: null
  }

  retrieveAvailableCams(userId) {
    axios.get(`api/cam/${userId}`)
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

  connectToCam(cam) {
    // socket.io and webRTC
  }
}

export default ViewCamContainer