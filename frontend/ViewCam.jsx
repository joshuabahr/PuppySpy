import React, { Component } from 'react';
import ViewCamDetail from './ViewCamDetail';

class ViewCam extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('View Cam props ', this.props);
    this.props.viewCamStore.retrieveAvailableCams(this.props.userStore.state.id);
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
      camListRender = camList.map(cam => (
        <div onClick={() => setActiveCam(cam)} key={cam.id} role="presentation">
          <li>
            Cam Name: {cam.camName}, Cam ID: {cam.id}
          </li>
        </div>
      ));
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
