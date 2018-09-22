import React, { Component } from 'react';
import { Subscribe } from 'unstated';
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

    if (camList) {
      camListRender = camList.map(cam => {
        let viewCamButton;
        if (!activeCam) {
          viewCamButton = (
            <button type="button" onClick={() => setActiveCam(cam)}>
              View Stream
            </button>
          );
        } else {
          viewCamButton = null;
        }
        return (
          <React.Fragment key={cam.id}>
            <li>
              Stream Name: {cam.camName}
              {viewCamButton}
            </li>
          </React.Fragment>
        );
      });
    } else {
      camListRender = <h4>No available cams</h4>;
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
      <div>
        <div>{camListRender}</div>
        <div>{activeCamRender}</div>
      </div>
    );
  }
}

export default ViewCam;
