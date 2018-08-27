import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// video capture, setup streaming, webRTC and socket.io functionality goes here
// add user functionality
// close cam

const socket = io();

class SetCamDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addUser: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.allowCamUser = this.allowCamUser.bind(this);
    this.handleConnection = this.handleConnection.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleRequestStream = this.handleRequestStream.bind(this);
  }

  componentDidMount() {
    console.log('props props ', this.props);
    const {
      peerConnectionStore: { setUpStream }
    } = this.props;
    setUpStream();
    this.handleConnection();
    this.handleRequestStream();
  }

  componentWillUnmount() {
    socket.removeAllListeners();
    this.handleLogOut();
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
