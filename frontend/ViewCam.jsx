import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import { Container, Row, Col, Button } from 'reactstrap';
import ViewCamDetail from './ViewCamDetail';
import PeerConnectionContainer from './Containers/PeerConnectionContainer';
import ViewCamContainer from './Containers/ViewCamContainer';

class ViewCam extends Component {
  componentDidMount() {
    const {
      viewCamStore: { retrieveAvailableCams },
      userStore: {
        state: { id }
      }
    } = this.props;
    console.log('View Cam props ', this.props);
    retrieveAvailableCams(id);
  }

  render() {
    const {
      viewCamStore: {
        setActiveCam,
        state: { camList, activeCam }
      },
      userStore
    } = this.props;

    let camListRender;
    let activeCamRender;

    if (camList && camList.length > 0) {
      console.log('cam list ', camList);
      camListRender = camList.map(cam => {
        let viewCamButton;
        if (!activeCam) {
          viewCamButton = (
            <Button size="sm" color="info" onClick={() => setActiveCam(cam)}>
              View Stream
            </Button>
          );
        } else {
          viewCamButton = (
            <Button size="sm" disabled color="secondary">
              View Stream
            </Button>
          );
        }
        return (
          <React.Fragment key={cam.id}>
            <li>
              Stream Name: {cam.camName} &nbsp;&nbsp;
              {viewCamButton}
            </li>
          </React.Fragment>
        );
      });
    } else {
      camListRender = <li>No available cams</li>;
    }

    if (activeCam) {
      activeCamRender = (
        <Subscribe to={[ViewCamContainer, PeerConnectionContainer]}>
          {(viewCamStore, peerConnectionStore) => (
            <ViewCamDetail
              viewCamStore={viewCamStore}
              peerConnectionStore={peerConnectionStore}
              cam={activeCam}
              userStore={userStore}
            />
          )}
        </Subscribe>
      );
    } else {
      activeCamRender = <h4>No active streams</h4>;
    }

    return (
      <Container fluid className="camview">
        <Row className="camrow">
          <Col className="camlist">
            <ul>{camListRender}</ul>
          </Col>
          <Col className="activecam">{activeCamRender}</Col>
        </Row>
      </Container>
    );
  }
}

export default ViewCam;
