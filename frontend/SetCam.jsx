import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import SetCamContainer from './Containers/SetCamContainer';
import PeerConnectionContainer from './Containers/PeerConnectionContainer';
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
        setActiveCam,
        state: { personalCamList, personalActiveCam, createNew }
      }
    } = this.props;

    let camListRender;
    let activeCamRender;
    let newCam;

    if (personalCamList) {
      camListRender = personalCamList.map(cam => (
        <div key={cam.id} onClick={() => setActiveCam(cam)} role="presentation">
          <li>
            Cam Name: {cam.camName}, Cam ID: {cam.id}
            <button type="button">delete cam</button>
          </li>
        </div>
      ));
    } else {
      camListRender = <h4>No available cams</h4>;
    }

    if (personalActiveCam) {
      activeCamRender = (
        <Subscribe to={[SetCamContainer, PeerConnectionContainer]}>
          {(setCamStore, peerConnectionStore) => (
            <SetCamDetail cam={personalActiveCam} setCamStore={setCamStore} peerConnectionStore={peerConnectionStore} />
          )}
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
