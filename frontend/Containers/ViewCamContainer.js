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

/* 
retrieveAvailableCams return format

[
  {
    "id": 1,
    "createdAt": "2018-08-09T21:39:38.611Z",
    "updatedAt": "2018-08-09T21:39:38.611Z",
    "userId": 1,
    "camId": 1,
    "cam": {
      "id": 1,
      "camName": "test1",
      "active": true,
      "password": "",
      "createdAt": "2018-08-09T21:39:38.164Z",
      "updatedAt": "2018-08-09T21:39:38.164Z",
      "userId": 1
    }
  },
  {
    "id": 5,
    "createdAt": "2018-08-09T22:22:52.639Z",
    "updatedAt": "2018-08-09T22:22:52.639Z",
    "userId": 1,
    "camId": 3,
    "cam": {
      "id": 3,
      "camName": "allow test 2",
      "active": true,
      "password": "",
      "createdAt": "2018-08-09T22:20:23.161Z",
      "updatedAt": "2018-08-09T22:20:23.161Z",
      "userId": 2
    }
  },
  {
    "id": 6,
    "createdAt": "2018-08-10T22:18:25.167Z",
    "updatedAt": "2018-08-10T22:18:25.167Z",
    "userId": 1,
    "camId": 4,
    "cam": {
      "id": 4,
      "camName": "test2",
      "active": true,
      "password": "",
      "createdAt": "2018-08-10T22:18:24.754Z",
      "updatedAt": "2018-08-10T22:18:24.754Z",
      "userId": 1
    }
  },
  {
    "id": 8,
    "createdAt": "2018-08-10T22:20:04.180Z",
    "updatedAt": "2018-08-10T22:20:04.180Z",
    "userId": 1,
    "camId": 5,
    "cam": {
      "id": 5,
      "camName": "allow test 3",
      "active": true,
      "password": "",
      "createdAt": "2018-08-10T22:19:25.361Z",
      "updatedAt": "2018-08-10T22:19:25.361Z",
      "userId": 2
    }
  }
]





*/
