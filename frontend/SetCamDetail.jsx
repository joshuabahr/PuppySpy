import React, { Component } from 'react';
import AllowUserModal from './AllowUserModal';

class SetCamDetail extends Component {
  constructor(props) {
    super(props);

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

  render() {
    const {
      cam,
      setCamStore: {
        handleInputChange,
        deleteCam,
        reloadAfterRemoteClose,
        handleModalShow,
        handleModalClose,
        allowCamUser,
        state: { allowUserModal, allowUser }
      },
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

    return (
      <div>
        <AllowUserModal show={allowUserModal} camId={cam.id} onClose={handleModalClose} allowCamUser={allowCamUser} />
        {motion}
        <div>
          <h5>Stream Name: {cam.camName}</h5>
        </div>
        <div>
          allow user access:
          <input type="text" name="allowUser" onChange={handleInputChange} value={allowUser} />
          <button type="button" onClick={() => handleModalShow()}>
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
