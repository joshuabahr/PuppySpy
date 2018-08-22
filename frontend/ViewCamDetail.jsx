import React, { Component } from 'react';
import io from 'socket.io-client';

// Video, receive streaming, socket.io and webRTC goes here

const socket = io();

class ViewCamDetail extends Component {
  constructor(props) {
    super(props);

    this.requestStream = this.requestStream.bind(this);
    this.handleData = this.handleData.bind(this);
  }

  componentDidMount() {
    this.requestStream();
    this.handleData();
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
      </div>
    );
  }
}

export default ViewCamDetail;
