import React, { Component } from 'react';
import io from 'socket.io-client';

// Video, receive streaming, socket.io and webRTC goes here

const socket = io();

class ViewCamDetail extends Component {
  constructor(props) {
    super(props);

    this.pc = null;

    this.requestStream = this.requestStream.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleNewIceCandidate = this.handleNewIceCandidate.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    const {
      peerConnectionStore: { setUpRecipient }
    } = this.props;
    setUpRecipient();
    this.requestStream();
    this.handleData();
    this.handleNewIceCandidate();
    console.log('peer connection !!!! ', this.pc);
  }

  componentWillUnmount() {
    socket.removeAllListeners();
    this.handleLogOut();
  }

  setCurrentCam = () => {
    const {
      peerConnectionStore: { setCam },
      viewCamStore: {
        state: { activeCam }
      }
    } = this.props;
    setCam(activeCam);
  };

  requestStream() {
    const { cam } = this.props;
    const requestInfo = { requester: 'requestInfo and SDP' };
    socket.connect();
    socket.emit('requeststream', { cam, requestInfo });
  }

  handleData() {
    socket.on('sendstream', streamInfo => {
      console.log('received data from other user ', streamInfo);
    });
  }

  handleNewIceCandidate() {
    socket.on('icecandidate', iceInfo => {
      console.log('new ice candidate ', iceInfo);
    });
  }

  handleLogOut() {
    const {
      viewCamStore: {
        setActiveCam,
        state: { activeCam }
      }
    } = this.props;
    socket.emit('leavestream', activeCam);
    setActiveCam(null);
  }

  render() {
    const {
      cam: { id, camName, userId, password }
    } = this.props;

    return (
      <div>
        <div>
          <h5>Cam Name: {camName}</h5>
        </div>
        <div>Cam ID: {id}</div>
        <div>User ID: {userId}</div>
        <div>Password: {password}</div>
        <div>
          <video id="remoteVideo" ref={this.remoteVideo} muted autoPlay />
        </div>
      </div>
    );
  }
}

export default ViewCamDetail;
