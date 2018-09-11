import React, { Component } from 'react';
import axios from 'axios';

// TODO: Close cam function, forces any open peer connections to close

class SetCamDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addUser: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.allowCamUser = this.allowCamUser.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    const {
      cam,
      peerConnectionStore: { setCam, setUpStream, setAndSendStreamDescription, handleNewIce, handleRemoteCloseStream }
    } = this.props;
    console.log('set cam detail props ', this.props);
    setCam(cam);
    setUpStream();
    setAndSendStreamDescription();
    handleNewIce();
    handleRemoteCloseStream();
  }

  componentWillUnmount() {
    const {
      motionDetectionStore: {
        stopMotionDetection,
        state: { motionDetectionActive }
      }
    } = this.props;
    this.logOut();
    if (motionDetectionActive) {
      stopMotionDetection();
    }
  }

  handleInputChange = e => {
    const input = {};
    input[e.target.name] = e.target.value;
    this.setState(() => input);
  };

  logOut() {
    const {
      cam,
      peerConnectionStore: { pc, handleStreamClose, handleLogOut, streamClosedFalse, remoteCloseStream },
      setCamStore: { setActiveCam, deleteCam }
    } = this.props;
    if (!pc) {
      handleStreamClose(cam);
    } else {
      handleLogOut(cam);
    }
    setActiveCam(null);
    streamClosedFalse();
    remoteCloseStream(cam);
    deleteCam(cam.id, cam.userId);
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
      })
      .catch(error => console.log('error allowing user access ', error));
  }

  render() {
    const {
      cam,
      setCamStore: { deleteCam, reloadAfterRemoteClose },
      peerConnectionStore: {
        remoteCloseStream,
        state: { streamClosed }
      },
      motionDetectionStore: {
        state: { motionDetected }
      }
    } = this.props;

    let motion;
    let videoOrClosed = (
      <div>
        <video id="localVideo" ref={this.localVideo} muted autoPlay playsInline />
      </div>
    );

    if (motionDetected) {
      motion = (
        <div>
          <h1>MOTION DETECTED</h1>
        </div>
      );
    } else {
      motion = null;
    }

    if (streamClosed) {
      videoOrClosed = (
        <div>
          <h1>Stream closed remotely</h1>
          <button
            type="button"
            onClick={() => {
              reloadAfterRemoteClose(cam.userId);
            }}
          >
            Start another stream
          </button>
        </div>
      );
    }

    const { addUser } = this.state;

    return (
      <div>
        {motion}
        <div>
          <h5>Stream Name: {cam.camName}</h5>
        </div>
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
              remoteCloseStream(cam);
              deleteCam(cam.id, cam.userId);
            }}
          >
            End Stream
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              const {
                userStore: {
                  state: { phone }
                },
                peerConnectionStore: { localStream },
                motionDetectionStore: { getLocalStream }
              } = this.props;
              getLocalStream(localStream, phone, cam.camName);
            }}
          >
            Set Motion Detection
          </button>
        </div>
        {videoOrClosed}
      </div>
    );
  }
}

export default SetCamDetail;
