import React, { Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import AllowUserModal from './AllowUserModal';

class SetCamDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      active: '5'
    };

    this.toggle = this.toggle.bind(this);
    this.selectCooldown = this.selectCooldown.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    const {
      cam,
      motionDetectionStore: { setCooldownTimerDefault, remoteCloseMotionDetection },
      peerConnectionStore: { setCam, setUpStream, setAndSendStreamDescription, handleNewIce, handleRemoteCloseStream }
    } = this.props;
    console.log('set cam detail props ', this.props, this.state);
    setCam(cam);
    setUpStream();
    setAndSendStreamDescription();
    handleNewIce();
    handleRemoteCloseStream();
    setCooldownTimerDefault();
    remoteCloseMotionDetection();
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

  selectCooldown(val) {
    const {
      motionDetectionStore: { setCooldownTimer }
    } = this.props;
    setCooldownTimer(val);
    this.setState({ active: val }, () => console.log('new state ', this.state));
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  logOut() {
    const {
      cam,
      peerConnectionStore: { localStream, handleLogOut, streamClosedFalse },
      setCamStore: { setActiveCam, deleteCam }
    } = this.props;
    if (localStream) {
      handleLogOut(cam);
    }
    setActiveCam(null);
    streamClosedFalse();
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
        handleLogOut,
        state: { streamClosed }
      },
      motionDetectionStore: {
        state: { motionDetected, motionDetectionActive }
      }
    } = this.props;

    const { dropdownOpen, active } = this.state;

    let motion;
    let videoOrClosed = (
      <React.Fragment>
        <AllowUserModal show={allowUserModal} camId={cam.id} onClose={handleModalClose} allowCamUser={allowCamUser} />
        <h5>Stream Name: {cam.camName}</h5>
        allow user access:
        <input type="text" name="allowUser" placeholder="email" onChange={handleInputChange} value={allowUser} />
        <Button size="sm" color="info" onClick={() => handleModalShow()}>
          Add
        </Button>
        <div className="buttongroup">
          <Button
            size="sm"
            color="info"
            onClick={() => {
              handleLogOut(cam);
              deleteCam(cam.id, cam.userId);
            }}
          >
            End Stream
          </Button>
          <Button
            size="sm"
            color="info"
            className={motionDetectionActive ? 'motiondetectionactive' : null}
            onClick={() => {
              const {
                userStore: {
                  state: { phone }
                },
                peerConnectionStore: { localStream },
                motionDetectionStore: { getLocalStream, stopMotionDetection }
              } = this.props;
              if (!phone) {
                alert('A phone number needs to be added to profile to receive motion detection alerts.');
              } else if (!motionDetectionActive) {
                getLocalStream(localStream, phone, cam);
              } else if (motionDetectionActive) {
                stopMotionDetection();
              }
            }}
          >
            Set Motion Detection
          </Button>
          <ButtonDropdown size="sm" isOpen={dropdownOpen} toggle={this.toggle}>
            <DropdownToggle color="info" caret>
              Set Motion Detection Cooldown
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                className={active === '1' ? 'active' : 'notactive'}
                value={1}
                onClick={e => this.selectCooldown(e.target.value)}
              >
                1 min
              </DropdownItem>
              <DropdownItem
                className={active === '5' ? 'active' : 'notactive'}
                value={5}
                onClick={e => this.selectCooldown(e.target.value)}
              >
                5 min
              </DropdownItem>
              <DropdownItem
                className={active === '15' ? 'active' : 'notactive'}
                value={15}
                onClick={e => this.selectCooldown(e.target.value)}
              >
                15 min
              </DropdownItem>
              <DropdownItem
                className={active === '30' ? 'active' : 'notactive'}
                value={30}
                onClick={e => this.selectCooldown(e.target.value)}
              >
                30 min
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <video id="localVideo" ref={this.localVideo} muted autoPlay playsInline />
      </React.Fragment>
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
        <React.Fragment>
          <h1>Stream closed remotely</h1>
          <Button
            size="small"
            onClick={() => {
              reloadAfterRemoteClose(cam.userId);
            }}
          >
            Start another stream
          </Button>
        </React.Fragment>
      );
    }

    return (
      <div>
        {motion}
        {videoOrClosed}
      </div>
    );
  }
}

export default SetCamDetail;
