import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import { Container, Row, Col, Button } from 'reactstrap';
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
        deleteRemoteCam,
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
      let endStreamButton;
      camListRender = personalCamList.map(cam => {
        if (personalActiveCam && personalActiveCam.id === cam.id) {
          endStreamButton = (
            <Button
              size="sm"
              className="setcambutton"
              color="danger"
              onClick={() => {
                deleteCam(cam.id, id);
              }}
            >
              End Stream
            </Button>
          );
        } else {
          endStreamButton = (
            <Button
              size="sm"
              className="setcambutton"
              color="danger"
              onClick={() => {
                remoteCloseStream(cam);
                deleteRemoteCam(cam.id, id);
              }}
            >
              End Stream
            </Button>
          );
        }
        return (
          <React.Fragment key={cam.id}>
            <li>
              <b>Cam Name:</b> {cam.camName} &nbsp;&nbsp;
              {endStreamButton}
            </li>
          </React.Fragment>
        );
      });
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
          <h5>Stream name:</h5>
          <input
            type="text"
            name="updateName"
            onChange={e => {
              handleInputChange(e);
            }}
          />

          <Button size="sm" color="info" onClick={this.createNewCam}>
            Add New Stream
          </Button>
        </React.Fragment>
      );
    } else if (personalActiveCam) {
      newCam = null;
    } else {
      newCam = (
        <Button size="sm" color="info" onClick={() => setCreateCam()}>
          Create New Stream
        </Button>
      );
    }

    return (
      <Container fluid className="camview">
        <Row className="camrow">
          <Col className="camlist">
            <ul>{camListRender}</ul>
            {newCam}
          </Col>
          <Col className="activecam">{activeCamRender}</Col>
        </Row>
      </Container>
    );
  }
}

export default SetCam;
