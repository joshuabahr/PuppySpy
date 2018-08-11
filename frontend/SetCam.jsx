import React, { Component } from 'react';
import SetCamDetail from './SetCamDetail';

class SetCam extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log('set cam props !!!!!', this.props);
  }

  componentDidMount() {
    console.log('set cam props ', this.props);
    this.props.setCamStore.retrievePersonalCams(this.props.userStore.state.id);
  }

  render() {
    const {
      setCamStore: {
        setActiveCam,
        state: { personalCamList, personalActiveCam }
      }
    } = this.props;

    let camListRender;
    let activeCamRender;

    if (personalCamList) {
      camListRender = personalCamList.map(cam => (
        <div onClick={() => setActiveCam(cam)} key={cam.id} role="presentation">
          <li>
            Cam Name: {cam.camName}, Cam ID: {cam.id}
          </li>
        </div>
      ));
    } else {
      camListRender = <h4>No available cams</h4>;
    }

    if (personalActiveCam) {
      activeCamRender = <SetCamDetail cam={personalActiveCam} />;
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

export default SetCam;
