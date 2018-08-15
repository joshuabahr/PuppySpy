import React, { Component } from 'react';
import axios from 'axios';

// video capture, setup streaming, webRTC and socket.io functionality goes here
// add user functionality
// close cam
class SetCamDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addUser: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.allowCamUser = this.allowCamUser.bind(this);
    this.gotLocalMediaStream = this.gotLocalMediaStream.bind(this);
    this.handleLocalMediaStreamError = this.handleLocalMediaStreamError.bind(this);
    this.setUpStream = this.setUpStream.bind(this);
  }

  componentDidMount() {
    this.setUpStream();
  }

  setUpStream() {
    const mediaStreamConstraints = {
      video: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaStreamConstraints)
      .then(this.gotLocalMediaStream)
      .catch(this.handleLocalMediaStreamError);
  }

  handleInputChange = e => {
    const input = {};
    input[e.target.name] = e.target.value;
    this.setState(() => input);
  };

  handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

  gotLocalMediaStream(mediaStream) {
    const localVideo = document.getElementById('outgoingVideo');
    localVideo.srcObject = mediaStream;
  }

  allowCamUser() {
    const { cam: id } = this.props;
    const { addUser } = this.state;
    axios
      .post(`api/cam/adduser`, {
        camId: id,
        email: addUser
      })
      .then(response => {
        console.log('allowed user access to cam ', response);
      })
      .then(() => {
        this.setState({
          addUser: ''
        });
      });
  }

  render() {
    const {
      cam: { id, camName, userId, password },
      setCamStore: { deleteCam }
    } = this.props;

    const { addUser } = this.state;

    return (
      <div>
        <div>
          <h5>Cam Name: {camName}</h5>
        </div>
        <div>Cam ID: {id}</div>
        <div>User ID: {userId}</div>
        <div>Password: {password}</div>
        <div>
          allow user access (email):
          <input type="text" name="addUser" onChange={this.handleInputChange} value={addUser} />
          <button type="button" onClick={this.allowCamUser}>
            Add
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              deleteCam(id, userId);
            }}
          >
            Delete Stream
          </button>
        </div>
        <div>
          <video id="outgoingVideo" ref={el => (this.outgoingVideo = el)} autoPlay />
        </div>
      </div>
    );
  }
}

export default SetCamDetail;
