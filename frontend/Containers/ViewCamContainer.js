import { Container } from 'unstated';
import axios from 'axios';

class ViewCamContainer extends Container {
  state = {
    camList: null,
    activeCam: null
  };

  retrieveAvailableCams = userId => {
    axios
      .get(`api/cam/${userId}`)
      .then(response => {
        console.log('view cam container state ', this.state);
        return this.formatCams(response.data);
      })
      .then(cams => {
        this.setState({
          camList: cams
        });
      })
      .catch(error => console.log('error retrieving available cams ', error));
  };

  setActiveCam = cam => {
    this.setState({
      activeCam: cam
    });
  };

  formatCams = cams => cams.map(cam => cam.cam);

  reloadAvailableStreams = userId => {
    this.setState({
      activeCam: null
    }).then(() => {
      this.retrieveAvailableCams(userId);
    });
  };
}

export default ViewCamContainer;
