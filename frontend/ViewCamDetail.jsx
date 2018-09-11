import React, { Component } from 'react';

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
      cam,
      peerConnectionStore: { handleLogOut },
      viewCamStore: { setActiveCam }
    } = this.props;
    console.log('logout props ', this.props);
    handleLogOut(cam);
    setActiveCam(null);
  }

  render() {
    const {
      cam,
      userStore: {
        state: { id }
      },
      peerConnectionStore: {
        state: { streamClosed }
      },
      viewCamStore: { reloadAvailableStreams, setActiveCam }
    } = this.props;

    let videoOrClosed = (
      <div>
        <video id="remoteVideo" ref={this.remoteVideo} muted autoPlay playsInline />
        <button
          type="button"
          onClick={() => {
            setActiveCam(null);
            reloadAvailableStreams(id);
          }}
        >
          View another stream
        </button>
      </div>
    );

    if (streamClosed) {
      videoOrClosed = (
        <div>
          <h1>Stream has been closed</h1>
          <button type="button" onClick={() => reloadAvailableStreams(id)}>
            View Another Stream
          </button>
        </div>
      );
    }

    return (
      <div>
        <div>
          <h5>Stream Name: {cam.camName}</h5>
        </div>
        {videoOrClosed}
      </div>
    );
  }
}

export default ViewCamDetail;
