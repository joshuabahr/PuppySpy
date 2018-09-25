import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import { Container, Row, Col, Button } from 'reactstrap';
import UserContainer from './Containers/UserContainer';
import SetCamContainer from './Containers/SetCamContainer';
import PeerConnectionContainer from './Containers/PeerConnectionContainer';
import MotionDetectionContainer from './Containers/MotionDetectionContainer';
import SetCamDetail from './SetCamDetail';

// when creating second cam, does not reload cam list

class SetCam extends Component {
  constructor(props) {
    super(props);

    this.createNewCam = this.createNewCam.bind(this);
  }

  componentDidMount() {
    console.log('set cam props ', this.props);
    const {
      setCamStore: { retrievePersonalCams },
      userStore: {
        state: { id }
      }
    } = this.props;
    retrievePersonalCams(id);
  }

  createNewCam() {
    const {
      userStore: {
        state: { id }
      },
      setCamStore: {
        createCam,
        state: { updateName, updatePassword }
      }
    } = this.props;
    createCam(id, updateName, updatePassword);
  }

  render() {
    const {
      setCamStore: {
        handleInputChange,
        setCreateCam,
        deleteCam,
        state: { personalCamList, personalActiveCam, createNew }
      },
      userStore: {
        state: { id }
      },
      peerConnectionStore: { remoteCloseStream }
    } = this.props;

    let camListRender;
    let activeCamRender;
    let newCam;

    if (personalCamList) {
      camListRender = personalCamList.map(cam => (
        <React.Fragment key={cam.id}>
          <li>
            <b>Cam Name:</b> {cam.camName} &nbsp;&nbsp;
            <Button
              className="setcambutton"
              color="danger"
              onClick={() => {
                remoteCloseStream(cam);
                deleteCam(cam.id, id);
              }}
            >
              End Stream
            </Button>
          </li>
        </React.Fragment>
      ));
    } else {
      camListRender = <h4>No active streams</h4>;
    }

    if (personalActiveCam) {
      activeCamRender = (
        <Subscribe to={[UserContainer, SetCamContainer, PeerConnectionContainer, MotionDetectionContainer]}>
          {(userStore, setCamStore, peerConnectionStore, motionDetectionStore) => (
            <SetCamDetail
              cam={personalActiveCam}
              userStore={userStore}
              setCamStore={setCamStore}
              peerConnectionStore={peerConnectionStore}
              motionDetectionStore={motionDetectionStore}
            />
          )}
        </Subscribe>
      );
    } else {
      activeCamRender = <h4>No stream active</h4>;
    }

    if (createNew) {
      newCam = (
        <React.Fragment>
          <div>
            <h5>Stream name:</h5>
            <input
              type="text"
              name="updateName"
              onChange={e => {
                handleInputChange(e);
              }}
            />
          </div>
          <div>
            <button type="button" onClick={this.createNewCam}>
              Add New Stream
            </button>
          </div>
        </React.Fragment>
      );
    } else if (personalActiveCam) {
      newCam = null;
    } else {
      newCam = (
        <Button color="info" onClick={() => setCreateCam()}>
          Create New Stream
        </Button>
      );
    }

    return (
      <Container fluid className="mainview setcam">
        <Row>
          <Col>
            <ul>{camListRender}</ul>
            {newCam}
          </Col>
          <Col>{activeCamRender}</Col>
        </Row>
      </Container>
    );
  }
}

export default SetCam;
