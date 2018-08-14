import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import SetCamContainer from './Containers/SetCamContainer';
import SetCamDetail from './SetCamDetail';

class SetCam extends Component {
  constructor(props) {
    super(props);

    this.createNewCam = this.createNewCam.bind(this);
  }

  componentWillMount() {
    console.log('set cam props !!!!!', this.props);
  }

  componentDidMount() {
    console.log('set cam props ', this.props);
    this.props.setCamStore.retrievePersonalCams(this.props.userStore.state.id);
  }

  createNewCam() {
    const userId = this.props.userStore.state.id;
    const camName = this.props.setCamStore.state.updateName;
    const password = this.props.setCamStore.state.updatePassword;
    this.props.setCamStore.createCam(userId, camName, password);
  }

  render() {
    const {
      setCamStore: {
        handleInputChange,
        setActiveCam,
        setCreateCam,
        state: { personalCamList, personalActiveCam, createNew }
      }
    } = this.props;

    let camListRender;
    let activeCamRender;
    let newCam;

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
      activeCamRender = (
        <Subscribe to={[SetCamContainer]}>
          {setCamStore => <SetCamDetail cam={personalActiveCam} setCamStore={setCamStore} />}
        </Subscribe>
      );
    } else {
      activeCamRender = <h4>No active cam</h4>;
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
            <h5>Stream password:</h5>
            <input
              type="text"
              name="updatePassword"
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
    } else {
      newCam = (
        <button type="button" onClick={() => setCreateCam()}>
          Create New Stream
        </button>
      );
    }

    return (
      <div>
        <div>{camListRender}</div>
        <div>{activeCamRender}</div>
        <div>{newCam}</div>
      </div>
    );
  }
}

export default SetCam;
