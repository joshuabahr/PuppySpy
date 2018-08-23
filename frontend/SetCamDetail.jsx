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

    this.pc = null;
    this.localStream = null;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.allowCamUser = this.allowCamUser.bind(this);
    this.gotLocalMediaStream = this.gotLocalMediaStream.bind(this);
    this.handleLocalMediaStreamError = this.handleLocalMediaStreamError.bind(this);
    this.setUpStream = this.setUpStream.bind(this);
    this.handleConnection = this.handleConnection.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleRequestStream = this.handleRequestStream.bind(this);
    this.createPeerConnection = this.createPeerConnection.bind(this);
    this.handleIceCandidate = this.handleIceCandidate.bind(this);
    this.handleRemoteStreamAdded = this.handleRemoteStreamAdded.bind(this);
    this.handleRemoteStreamRemoved = this.handleRemoteStreamRemoved.bind(this);
    this.newOffer = this.newOffer.bind(this);
  }

  componentDidMount() {
    this.setUpStream();
    this.handleConnection();
    this.handleRequestStream();
  }

  componentWillUnmount() {
    socket.removeAllListeners();
    this.handleLogOut();
  }

  setUpStream() {
    const mediaStreamConstraints = {
      audio: false,
      video: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaStreamConstraints)
      .then(this.gotLocalMediaStream)
      .then(this.createPeerConnection())
      .then(() => {
        this.pc.addStream(this.localStream);
      })
      .then(() => {
        this.newOffer();
      })
      .then(() => {
        console.log('peer connection ', this.pc);
      })
      .catch(this.handleLocalMediaStreamError);
  }

  handleInputChange = e => {
    const input = {};
    input[e.target.name] = e.target.value;
    this.setState(() => input);
  };

  createPeerConnection() {
    try {
      this.pc = new RTCPeerConnection(null);
      this.pc.onicecandidate = this.handleIceCandidate;
      this.pc.onaddstream = this.handleRemoteStreamAdded;
      this.pc.onremovestream = this.handleRemoteStreamRemoved;
      console.log('Created RTCPeerConnection');
    } catch (e) {
      console.log('Failed to create PeerConnection, exception: ', e.message);
    }
  }

  newOffer() {
    this.pc.createOffer().then(offer => this.pc.setLocalDescription(offer));
  }

  handleIceCandidate(event) {
    console.log('icecandidate event ', event);
    if (event.candidate) {
      socket.emit('icecandidate', {
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate
      });
    } else {
      console.log('End of Candidates');
    }
  }

  handleRemoteStreamAdded(event) {
    const mediaStream = event.stream;
    const remoteVideo = document.getElementById('remoteVideo');
    remoteVideo.srcObject = mediaStream;
  }

  handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed ', event);
  }

  gotLocalMediaStream(mediaStream) {
    console.log('mediaStream ', mediaStream);
    this.localStream = mediaStream;
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = mediaStream;
  }

  handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

  handleConnection() {
    const { cam } = this.props;
    socket.connect();
    socket.emit('enterstream', cam);
  }

  handleRequestStream() {
    const streamInfo = { streamer: 'streamerInfo and SDP' };
    const { cam } = this.props;
    socket.on('requeststream', requestInfo => {
      console.log('user requested access to stream', requestInfo);
      socket.emit('sendstream', { cam, streamInfo });
    });
  }

  handleLogOut() {
    const {
      cam,
      setCamStore: { setActiveCam }
    } = this.props;
    socket.emit('leavestream', cam);
    setActiveCam(null);
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
          <video id="localVideo" ref={this.localVideo} muted autoPlay />
        </div>
      </div>
    );
  }
}

export default SetCamDetail;
