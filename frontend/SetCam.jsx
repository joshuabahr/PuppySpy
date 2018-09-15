import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import { Container, Row, Col } from 'reactstrap';
import UserContainer from './Containers/UserContainer';
import SetCamContainer from './Containers/SetCamContainer';
import PeerConnectionContainer from './Containers/PeerConnectionContainer';
import MotionDetectionContainer from './Containers/MotionDetectionContainer';
import SetCamDetail from './SetCamDetail';

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
        <div key={cam.id}>
          <li>
            Cam Name: {cam.camName}, Cam ID: {cam.id}
            <button
              type="button"
              onClick={() => {
                remoteCloseStream(cam);
                deleteCam(cam.id, id);
              }}
            >
              End Stream
            </button>
          </li>
        </div>
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
      activeCamRender = null;
    }

    if (createNew) {
      newCam = (
        <div>
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
        </div>
      );
    } else if (personalActiveCam) {
      newCam = null;
    } else {
      newCam = (
        <button type="button" onClick={() => setCreateCam()}>
          Create New Stream
        </button>
      );
    }

    return (
      <Container fluid>
        <Row>
          <Col>
            <div>{camListRender}</div>
            <div>{newCam}</div>
          </Col>
          <Col>
            <div>{activeCamRender}</div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SetCam;
