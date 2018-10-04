import React, { Component } from 'react';
import { Button } from 'reactstrap';

class ViewCamDetail extends Component {
  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this);
    this.setCurrentCam = this.setCurrentCam.bind(this);
  }

  componentDidMount() {
    const {
      peerConnectionStore: { setUpRecipient, setStreamerDescription, handleNewIce, handleViewStreamClosed }
    } = this.props;
    this.setCurrentCam();
    setUpRecipient();
    setStreamerDescription();
    handleNewIce();
    handleViewStreamClosed();
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
      peerConnectionStore: { handleCloseRemoteViewing, streamClosedFalse },
      viewCamStore: { setActiveCam }
    } = this.props;
    console.log('logout props ', this.props);
    handleCloseRemoteViewing(cam);
    setActiveCam(null);
    streamClosedFalse();
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
        <Button
          color="info"
          onClick={() => {
            setActiveCam(null);
            reloadAvailableStreams(id);
          }}
        >
          View another stream
        </Button>
        <video id="remoteVideo" ref={this.remoteVideo} muted autoPlay playsInline />
      </div>
    );

    if (streamClosed) {
      videoOrClosed = (
        <div>
          <h1>Stream has been closed</h1>
          <Button color="info" onClick={() => reloadAvailableStreams(id)}>
            View Another Stream
          </Button>
        </div>
      );
    }

    return (
      
        <div>
          <h5>Stream Name: {cam.camName}</h5>
          {videoOrClosed}
        </div>
      
    );
  }
}

export default ViewCamDetail;
