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
      peerConnectionStore: { setUpRecipient, setStreamerDescription, handleNewIce }
    } = this.props;
    this.setCurrentCam();
    setUpRecipient();
    setStreamerDescription();
    handleNewIce();
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
          <video id="remoteVideo" ref={this.remoteVideo} muted autoPlay playsInline />
        </div>
      </div>
    );
  }
}

export default ViewCamDetail;
