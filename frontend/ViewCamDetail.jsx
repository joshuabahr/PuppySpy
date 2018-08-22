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
    this.createPeerConnection = this.createPeerConnection.bind(this);
    this.handleIceCandidate = this.handleIceCandidate.bind(this);
    this.handleRemoteStreamAdded = this.handleRemoteStreamAdded.bind(this);
    this.handleRemoteStreamRemoved = this.handleRemoteStreamRemoved.bind(this);
  }

  componentDidMount() {
    this.requestStream();
    this.handleData();
  }

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
