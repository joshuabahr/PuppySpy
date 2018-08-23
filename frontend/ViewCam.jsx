import React, { Component } from 'react';
import ViewCamDetail from './ViewCamDetail';

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
      }
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
          <div key={cam.id}>
            <li>
              Cam Name: {cam.camName}, Cam ID: {cam.id}
              {viewCamButton}
            </li>
          </div>
        );
      });
    } else {
      camListRender = <h4>No available cams</h4>;
    }

    if (activeCam) {
      activeCamRender = <ViewCamDetail cam={activeCam} />;
    } else {
      activeCamRender = <h4>No active cam</h4>;
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
