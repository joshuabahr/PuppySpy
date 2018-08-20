import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// video capture, setup streaming, webRTC and socket.io functionality goes here
// add user functionality
// close cam

const socket = io();

const PC_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

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
    this.handleConnection = this.handleConnection.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    this.setUpStream();
    this.handleConnection();
  }

  componentWillUnmount() {
    socket.removeAllListeners();
    this.handleLogOut();
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

  handleConnection() {
    const { cam } = this.props;
    socket.connect();
    socket.emit('enterstream', cam);
  }

  handleLogOut() {
    const {
      cam,
      setCamStore: { setActiveCam }
    } = this.props;
    socket.emit('leavestream', cam);
    setActiveCam(null);
  }

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
