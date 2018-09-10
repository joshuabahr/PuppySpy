import React, { Component } from 'react';

// TODO: add 'View Another Stream' button, sets currentCam to null

class ViewCamDetail extends Component {
  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this);
    this.setCurrentCam = this.setCurrentCam.bind(this);
  }

  componentDidMount() {
    const {
      peerConnectionStore: { setUpRecipient, setStreamerDescription, handleNewIce, handleRemoteCloseStream }
    } = this.props;
    this.setCurrentCam();
    setUpRecipient();
    setStreamerDescription();
    handleNewIce();
    handleRemoteCloseStream();
  }

  componentWillUnmount() {
    this.logOut();
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

  logOut() {
    const {
      peerConnectionStore: { handleLogOut },
      viewCamStore: {
        setActiveCam,
        state: { activeCam }
      }
    } = this.props;
    handleLogOut(activeCam);
    setActiveCam(null);
  }

  render() {
    const {
      cam: { id, camName, userId, password },
      peerConnectionStore: {
        state: { streamClosed }
      }
    } = this.props;

    let videoOrClosed = (
      <div>
        <video id="remoteVideo" ref={this.remoteVideo} muted autoPlay playsInline />
      </div>
    );

    if (streamClosed) {
      videoOrClosed = (
        <div>
          <h1>Stream has been closed</h1>
          <button type="button">View Another Stream</button>
        </div>
      );
    }

    return (
      <div>
        <div>
          <h5>Cam Name: {camName}</h5>
        </div>
        <div>Cam ID: {id}</div>
        <div>User ID: {userId}</div>
        <div>Password: {password}</div>
        {videoOrClosed}
      </div>
    );
  }
}

export default ViewCamDetail;
