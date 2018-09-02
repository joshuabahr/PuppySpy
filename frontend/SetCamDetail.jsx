import React, { Component } from 'react';
import axios from 'axios';

// TODO: Close cam function, forces any open peer connections to close

class SetCamDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addUser: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.allowCamUser = this.allowCamUser.bind(this);
    this.logOut = this.logOut.bind(this);
    this.setCurrentCam = this.setCurrentCam.bind(this);
  }

  componentDidMount() {
    const {
      peerConnectionStore: { setUpStream, setAndSendStreamDescription, handleNewIce }
    } = this.props;
    this.setCurrentCam();
    setUpStream();
    setAndSendStreamDescription();
    handleNewIce();
  }

  componentWillUnmount() {
    this.logOut();
  }

  setCurrentCam = () => {
    const {
      cam,
      peerConnectionStore: { setCam }
    } = this.props;
    setCam(cam);
  };

  handleInputChange = e => {
    const input = {};
    input[e.target.name] = e.target.value;
    this.setState(() => input);
  };

  logOut() {
    const {
      cam,
      peerConnectionStore: { handleLogOut },
      setCamStore: { setActiveCam }
    } = this.props;
    handleLogOut(cam);
    setActiveCam(null);
  }

  allowCamUser() {
    const { cam: id } = this.props;
    const { addUser } = this.state;
    axios
      .post(`api/cam/adduser`, {
        camId: id,
        email: addUser
      })
      .then(response => {
        console.log('allowed user access to cam ', response);
      })
      .then(() => {
        this.setState({
          addUser: ''
        });
      });
  }

  render() {
    const {
      cam: { id, camName, userId, password },
      setCamStore: { deleteCam }
    } = this.props;

    const { addUser } = this.state;

    return (
      <div>
        <div>
          <h5>Cam Name: {camName}</h5>
        </div>
        <div>Cam ID: {id}</div>
        <div>User ID: {userId}</div>
        <div>Password: {password}</div>
        <div>
          allow user access (email):
          <input type="text" name="addUser" onChange={this.handleInputChange} value={addUser} />
          <button type="button" onClick={this.allowCamUser}>
            Add
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              deleteCam(id, userId);
            }}
          >
            Delete Stream
          </button>
        </div>
        <div>
          <video id="localVideo" ref={this.localVideo} muted autoPlay playsInline />
        </div>
      </div>
    );
  }
}

export default SetCamDetail;
